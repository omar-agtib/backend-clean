// ws/notification.js
const { getIO } = require("./io");
const { userRoom } = require("./rooms");

function notifyUser(userId, payload) {
  getIO().to(userRoom(userId)).emit("notification", payload);
}

module.exports = { notifyUser };
