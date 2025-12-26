// modules/projects/project.service.js
const mongoose = require("mongoose");
const Project = require("./project.model");
const projectEvents = require("../../ws/projectEvents");

const ROLES = ["PROJECT_MANAGER", "QUALITY", "TEAM_LEADER", "WORKER"];

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}

exports.createProject = async (data, userId) => {
  if (!data?.name || !String(data.name).trim())
    throw badRequest("name is required");

  const project = await Project.create({
    name: String(data.name).trim(),
    description: data.description ? String(data.description).trim() : undefined,
    status: data.status || "PLANNING",
    owner: userId,
    members: [{ userId, role: "PROJECT_MANAGER" }], // owner is manager
    startDate: data.startDate,
    endDate: data.endDate,
    createdBy: userId,
  });

  projectEvents.projectCreated(project);
  return project;
};

exports.listProjectsForUser = async (userId) => {
  return Project.find({
    isDeleted: false,
    $or: [{ owner: userId }, { "members.userId": userId }],
  }).sort({ createdAt: -1 });
};

exports.getById = async (projectId) => {
  if (!mongoose.isValidObjectId(projectId))
    throw badRequest("Invalid projectId");

  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project) throw notFound("Project not found");

  return project;
};

exports.updateProject = async (project, data, userId) => {
  if (!project) throw notFound("Project not found");

  if (data.name !== undefined) {
    const name = String(data.name || "").trim();
    if (!name) throw badRequest("name cannot be empty");
    project.name = name;
  }

  if (data.description !== undefined) {
    project.description = data.description
      ? String(data.description).trim()
      : "";
  }

  if (data.status !== undefined) {
    const allowed = ["PLANNING", "ACTIVE", "COMPLETED", "ARCHIVED"];
    if (!allowed.includes(data.status)) {
      throw badRequest(`Invalid status. Must be one of: ${allowed.join(", ")}`);
    }
    project.status = data.status;
  }

  if (data.startDate !== undefined) project.startDate = data.startDate;
  if (data.endDate !== undefined) project.endDate = data.endDate;

  project.updatedBy = userId;
  await project.save();

  projectEvents.projectUpdated(project._id, {
    projectId: project._id,
    name: project.name,
    status: project.status,
  });

  return project;
};

exports.softDeleteProject = async (project, userId) => {
  if (!project) throw notFound("Project not found");

  project.isDeleted = true;
  project.updatedBy = userId;
  await project.save();

  projectEvents.projectUpdated(project._id, {
    projectId: project._id,
    isDeleted: true,
  });
  return { message: "Project deleted", projectId: project._id };
};

exports.addMember = async (project, userId, role) => {
  if (!userId) throw badRequest("userId is required");
  if (!mongoose.isValidObjectId(userId)) throw badRequest("Invalid userId");
  if (!role) throw badRequest("role is required");
  if (!ROLES.includes(role))
    throw badRequest(`Invalid role. Must be: ${ROLES.join(", ")}`);

  const exists = project.members.some(
    (m) => String(m.userId) === String(userId)
  );
  if (exists) {
    const err = new Error("User already a member");
    err.status = 409;
    throw err;
  }

  project.members.push({ userId, role });
  await project.save();

  projectEvents.memberAdded(project._id, { userId, role });

  return project;
};

exports.removeMember = async (project, userId) => {
  if (!userId) throw badRequest("userId is required");
  if (!mongoose.isValidObjectId(userId)) throw badRequest("Invalid userId");

  const uid = String(userId);

  // 🚫 cannot remove owner
  if (String(project.owner) === uid) {
    const err = new Error("Cannot remove project owner");
    err.status = 409;
    throw err;
  }

  const before = project.members.length;
  const removedMember = project.members.find((m) => String(m.userId) === uid);

  project.members = project.members.filter((m) => String(m.userId) !== uid);

  if (project.members.length === before) {
    const err = new Error("User is not a member");
    err.status = 404;
    throw err;
  }

  // 🚫 cannot remove last PROJECT_MANAGER
  const managersLeft = project.members.filter(
    (m) => m.role === "PROJECT_MANAGER"
  ).length;
  if (removedMember?.role === "PROJECT_MANAGER" && managersLeft === 0) {
    // rollback
    project.members.push(removedMember);
    const err = new Error("Cannot remove the last PROJECT_MANAGER");
    err.status = 409;
    throw err;
  }

  await project.save();

  projectEvents.memberRemoved(project._id, uid);
  return project;
};
