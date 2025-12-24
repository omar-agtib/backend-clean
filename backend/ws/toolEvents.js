const { getIO } = require("./index");

function toolAssigned(tool) {
  getIO().emit("tool:assigned", tool);
}

function toolReturned(tool) {
  getIO().emit("tool:returned", tool);
}

module.exports = {
  toolAssigned,
  toolReturned,
};
