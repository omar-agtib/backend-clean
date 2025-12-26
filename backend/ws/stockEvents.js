const { getIO } = require("./io");
const { projectRoom } = require("./rooms");

function stockUpdated(projectId, stockItem) {
  getIO().to(projectRoom(projectId)).emit("stock:updated", stockItem);
}

function stockMovementRecorded(projectId, movement) {
  getIO().to(projectRoom(projectId)).emit("stock:movementRecorded", movement);
}

module.exports = {
  stockUpdated,
  stockMovementRecorded,
};
