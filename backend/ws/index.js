// ws/index.js
const { Server } = require("socket.io");
const planEvents = require("./planEvents");
const { setIO } = require("./io");
const { projectRoom, userRoom } = require("./rooms");

function initWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  setIO(io);

  io.on("connection", (socket) => {
    console.log("🟢 WS connected:", socket.id);

    /**
     * Join a project room
     * Front sends: socket.emit("join:project", projectId)
     */
    socket.on("join:project", (projectId) => {
      if (!projectId) return;
      socket.join(projectRoom(projectId));
    });

    /**
     * Join a user room (for personal notifications)
     * Front sends: socket.emit("join:user", userId)
     * (Later you can secure it by verifying JWT)
     */
    socket.on("join:user", (userId) => {
      if (!userId) return;
      socket.join(userRoom(userId));
    });

    /**
     * Optional: leave rooms
     */
    socket.on("leave:project", (projectId) => {
      if (!projectId) return;
      socket.leave(projectRoom(projectId));
    });

    socket.on("leave:user", (userId) => {
      if (!userId) return;
      socket.leave(userRoom(userId));
    });

    // Register domain socket handlers (optional)
    planEvents.registerSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("🔴 WS disconnected:", socket.id);
    });
  });

  console.log("✅ WebSocket initialized");
  return io;
}

module.exports = { initWebSocket };
