const { Server } = require("socket.io");

let io;

function initWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 WS connected:", socket.id);

    socket.on("join:project", (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 WS disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = {
  initWebSocket,
  getIO,
};
