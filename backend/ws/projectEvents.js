const { getIO } = require("./io");
const { projectRoom } = require("./rooms");

// Emit to everyone (global)
function projectCreated(project) {
  getIO().emit("project:created", project);
}

// Emit to specific project room
function projectUpdated(projectId, data) {
  getIO().to(projectRoom(projectId)).emit("project:updated", data);
}

function memberAdded(projectId, payload) {
  getIO().to(projectRoom(projectId)).emit("project:memberAdded", payload);
}

function memberRemoved(projectId, userId) {
  getIO().to(projectRoom(projectId)).emit("project:memberRemoved", { userId });
}

module.exports = {
  projectCreated,
  projectUpdated,
  memberAdded,
  memberRemoved,
};
