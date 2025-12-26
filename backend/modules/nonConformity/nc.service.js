// modules/nonConformity/nc.service.js
const NC = require("./nc.model");
const History = require("./ncHistory.model");
const ncEvents = require("../../ws/ncEvents");

// 🔔 Notifications
const notifyService = require("../notifications/notification.service");
const Project = require("../projects/project.model");

const allowedTransitions = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["VALIDATED", "IN_PROGRESS"],
  VALIDATED: [],
};

const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "VALIDATED"];
const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

async function record(nc, action, from, to, userId, comment) {
  return History.create({
    ncId: nc._id,
    action,
    fromStatus: from,
    toStatus: to,
    userId,
    comment,
  });
}

exports.create = async (data, userId) => {
  if (!data.projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }
  if (!data.title || !String(data.title).trim()) {
    const err = new Error("title is required");
    err.status = 400;
    throw err;
  }
  if (data.priority && !allowedPriorities.includes(data.priority)) {
    const err = new Error(
      `priority must be one of: ${allowedPriorities.join(", ")}`
    );
    err.status = 400;
    throw err;
  }

  const nc = await NC.create({
    projectId: data.projectId,
    title: String(data.title).trim(),
    description: data.description || "",
    priority: data.priority || "MEDIUM",
    status: "OPEN",
    assignedTo: data.assignedTo || null,

    planId: data.planId,
    planVersionId: data.planVersionId,
    annotationId: data.annotationId,

    attachments: Array.isArray(data.attachments) ? data.attachments : [],

    createdBy: userId,
    updatedBy: userId,
    isDeleted: false,
  });

  await record(nc, "CREATED", null, "OPEN", userId, data.comment);

  ncEvents.ncCreated(nc.projectId, nc);
  return nc;
};

exports.assign = async (nc, assigneeId, userId) => {
  if (!nc || nc.isDeleted) {
    const err = new Error("NC not found");
    err.status = 404;
    throw err;
  }
  if (!assigneeId) {
    const err = new Error("assignedTo is required");
    err.status = 400;
    throw err;
  }

  const from = nc.status;
  const to = "IN_PROGRESS";

  if (!allowedTransitions[from]?.includes(to)) {
    const err = new Error(`Invalid transition ${from} → ${to}`);
    err.status = 400;
    throw err;
  }

  nc.assignedTo = assigneeId;
  nc.status = to;
  nc.updatedBy = userId;

  await nc.save();
  await record(nc, "ASSIGNED", from, to, userId);

  // ✅ WS update
  ncEvents.ncUpdated(nc.projectId, nc);

  // 🔔 Notify assigned user
  await notifyService.createAndEmit({
    userId: assigneeId,
    projectId: nc.projectId,
    type: "NC_ASSIGNED",
    title: "New NC assigned to you",
    message: `NC "${nc.title}" has been assigned to you.`,
    data: { ncId: nc._id, projectId: nc.projectId, status: nc.status },
  });

  return nc;
};

exports.changeStatus = async (nc, toStatus, userId, comment) => {
  if (!nc || nc.isDeleted) {
    const err = new Error("NC not found");
    err.status = 404;
    throw err;
  }

  if (!toStatus) {
    const err = new Error("status is required");
    err.status = 400;
    throw err;
  }

  if (!allowedStatuses.includes(toStatus)) {
    const err = new Error(
      `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`
    );
    err.status = 400;
    throw err;
  }

  const from = nc.status;

  if (!allowedTransitions[from]?.includes(toStatus)) {
    const err = new Error(`Invalid transition ${from} → ${toStatus}`);
    err.status = 400;
    throw err;
  }

  nc.status = toStatus;
  nc.updatedBy = userId;

  await nc.save();

  await record(
    nc,
    toStatus === "VALIDATED" ? "VALIDATED" : "STATUS_CHANGED",
    from,
    toStatus,
    userId,
    comment
  );

  if (toStatus === "VALIDATED") {
    ncEvents.ncValidated(nc.projectId, nc);

    // 🔔 Notify project members (owner + members), excluding actor
    const project = await Project.findById(nc.projectId);
    if (project) {
      const userIds = new Set([
        String(project.owner),
        ...project.members.map((m) => String(m.userId)),
      ]);

      userIds.delete(String(userId));

      await Promise.all(
        [...userIds].map((uid) =>
          notifyService.createAndEmit({
            userId: uid,
            projectId: nc.projectId,
            type: "NC_VALIDATED",
            title: "NC validated",
            message: `NC "${nc.title}" was validated.`,
            data: { ncId: nc._id, projectId: nc.projectId, status: nc.status },
          })
        )
      );
    }
  } else {
    ncEvents.ncUpdated(nc.projectId, nc);
  }

  return nc;
};

exports.listByProject = async (projectId) => {
  if (!projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }
  return NC.find({ projectId, isDeleted: false }).sort({ createdAt: -1 });
};

exports.getHistory = async (ncId) => {
  if (!ncId) {
    const err = new Error("ncId is required");
    err.status = 400;
    throw err;
  }
  return History.find({ ncId }).sort({ createdAt: 1 }).populate("userId");
};
