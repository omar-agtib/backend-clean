const Project = require("./project.model");
const projectEvents = require("../../ws/projectEvents"); // WS events

/**
 * Create a new project
 * @param {Object} data
 * @param {string} userId - owner/creator
 */
exports.createProject = async (data, userId) => {
  if (!data.name) throw new Error("Project name is required");

  const project = await Project.create({
    ...data,
    owner: userId,
    members: [],
    createdBy: userId,
  });

  // Emit WebSocket event: project created
  projectEvents.projectCreated(project);

  return project;
};

/**
 * List all projects for a user
 * @param {string} userId
 */
exports.listProjectsForUser = async (userId) => {
  return Project.find({
    isDeleted: false,
    $or: [{ owner: userId }, { "members.userId": userId }],
  });
};

/**
 * Add a member to a project
 * @param {Object} project - Project document
 * @param {string} userId
 * @param {string} role
 */
exports.addMember = async (project, userId, role) => {
  const exists = project.members.some((m) => m.userId.toString() === userId);

  if (exists) {
    throw new Error("User already a member");
  }

  project.members.push({ userId, role });
  await project.save();

  // Emit WS event: member added
  projectEvents.memberAdded(project._id, { userId, role });

  return project;
};

/**
 * Remove a member from a project
 * @param {Object} project - Project document
 * @param {string} userId
 */
exports.removeMember = async (project, userId) => {
  project.members = project.members.filter(
    (m) => m.userId.toString() !== userId
  );
  await project.save();

  // Emit WS event: member removed
  projectEvents.memberRemoved(project._id, userId);

  return project;
};
