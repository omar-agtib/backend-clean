const { getIO } = require("./index");
const { projectRoom } = require("./rooms");

function annotationAdded(projectId, annotation) {
  getIO().to(projectRoom(projectId)).emit("annotation:added", annotation);
}

function annotationUpdated(projectId, annotation) {
  getIO().to(projectRoom(projectId)).emit("annotation:updated", annotation);
}

module.exports = {
  annotationAdded,
  annotationUpdated,
};
