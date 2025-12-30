// backend/ws/index.js
const { Server } = require("socket.io");
const planEvents = require("./planEvents");
const { setIO } = require("./io");
const { projectRoom, userRoom } = require("./rooms");

function initWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  setIO(io);

  io.on("connection", (socket) => {
    console.log("🟢 WS connected:", socket.id);

    // ✅ Join project room
    socket.on("join:project", (projectId) => {
      if (!projectId) return;
      socket.join(projectRoom(projectId));
    });

    // ✅ Join user room (notifications)
    socket.on("join:user", (userId) => {
      if (!userId) return;
      socket.join(userRoom(userId));
    });

    socket.on("leave:project", (projectId) => {
      if (!projectId) return;
      socket.leave(projectRoom(projectId));
    });

    socket.on("leave:user", (userId) => {
      if (!userId) return;
      socket.leave(userRoom(userId));
    });

    planEvents.registerSocketHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log("🔴 WS disconnected:", socket.id, "reason=", reason);
    });
  });

  console.log("✅ WebSocket initialized");
  return io;
}

module.exports = { initWebSocket };
