// backend/ws/progressEvents.js
const { getIO } = require("./io");
const { projectRoom } = require("./rooms");

function milestoneCreated(projectId, milestone) {
  getIO().to(projectRoom(projectId)).emit("milestone:created", milestone);
}

function milestoneUpdated(projectId, milestone) {
  getIO().to(projectRoom(projectId)).emit("milestone:updated", milestone);
}

function milestoneDeleted(projectId, milestoneId) {
  getIO().to(projectRoom(projectId)).emit("milestone:deleted", { milestoneId });
}

module.exports = {
  milestoneCreated,
  milestoneUpdated,
  milestoneDeleted,
};
