const { getIO } = require("./io");
const { projectRoom } = require("./rooms");

function ncCreated(projectId, nc) {
  getIO().to(projectRoom(projectId)).emit("nc:created", nc);
}

function ncUpdated(projectId, nc) {
  getIO().to(projectRoom(projectId)).emit("nc:updated", nc);
}

function ncValidated(projectId, nc) {
  getIO().to(projectRoom(projectId)).emit("nc:validated", nc);
}

module.exports = {
  ncCreated,
  ncUpdated,
  ncValidated,
};
