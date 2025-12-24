const { getIO } = require("./index");
const { projectRoom } = require("./rooms");

function projectUpdated(projectId, data) {
  getIO().to(projectRoom(projectId)).emit("project:updated", data);
}

module.exports = {
  projectUpdated,
};
