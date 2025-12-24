const { getIO } = require("./index");

function notifyUser(userId, payload) {
  getIO().to(`user:${userId}`).emit("notification", payload);
}

module.exports = {
  notifyUser,
};
