const NC = require("./nc.model");
const History = require("./ncHistory.model");
const ncEvents = require("../../ws/ncEvents"); // WS events

const allowedTransitions = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["VALIDATED", "IN_PROGRESS"],
};

// Internal helper: record history
async function record(nc, action, from, to, userId, comment) {
  await History.create({
    ncId: nc._id,
    action,
    fromStatus: from,
    toStatus: to,
    userId,
    comment,
  });
}

exports.create = async (data, userId) => {
  const nc = await NC.create({
    ...data,
    createdBy: userId,
  });

  await record(nc, "CREATED", null, "OPEN", userId);

  // Emit WebSocket event: new NC created
  ncEvents.ncCreated(nc.projectId, nc);

  return nc;
};

exports.assign = async (nc, assigneeId, userId) => {
  const from = nc.status;

  nc.assignedTo = assigneeId;
  nc.status = "IN_PROGRESS";
  nc.updatedBy = userId;

  await nc.save();
  await record(nc, "ASSIGNED", from, "IN_PROGRESS", userId);

  // Emit WebSocket event: NC updated (assigned)
  ncEvents.ncUpdated(nc.projectId, nc);

  return nc;
};

exports.changeStatus = async (nc, toStatus, userId, comment) => {
  const from = nc.status;

  if (!allowedTransitions[from]?.includes(toStatus)) {
    throw new Error(`Invalid transition ${from} → ${toStatus}`);
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

  // Emit WebSocket event: NC updated or validated
  if (toStatus === "VALIDATED") {
    ncEvents.ncValidated(nc.projectId, nc);
  } else {
    ncEvents.ncUpdated(nc.projectId, nc);
  }

  return nc;
};

exports.listByProject = async (projectId) => {
  return NC.find({ projectId, isDeleted: false });
};
