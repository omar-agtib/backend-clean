// backend/ws/io.js
let io = null;

function setIO(ioInstance) {
  io = ioInstance;
}

function getIO() {
  if (!io) {
    throw new Error(
      "Socket.io not initialized. Call initWebSocket(server) first."
    );
  }
  return io;
}

module.exports = { setIO, getIO };
