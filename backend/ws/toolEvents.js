const { getIO } = require("./io");
const { projectRoom } = require("./rooms");

function toolAssigned(projectId, payload) {
  getIO().to(projectRoom(projectId)).emit("tool:assigned", payload);
}

function toolReturned(projectId, payload) {
  getIO().to(projectRoom(projectId)).emit("tool:returned", payload);
}

function toolMaintenanceStarted(projectId, payload) {
  getIO().to(projectRoom(projectId)).emit("tool:maintenanceStarted", payload);
}

function toolMaintenanceCompleted(projectId, payload) {
  getIO().to(projectRoom(projectId)).emit("tool:maintenanceCompleted", payload);
}

module.exports = {
  toolAssigned,
  toolReturned,
  toolMaintenanceStarted,
  toolMaintenanceCompleted,
};
