// backend/ws/index.js
const { Server } = require("socket.io");
const planEvents = require("./planEvents");
const { setIO } = require("./io");
const { projectRoom, userRoom } = require("./rooms");

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"], // keep strict for dev
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
    pingTimeout: 30000,
    pingInterval: 25000,
  });

  setIO(io);

  io.on("connection", (socket) => {
    console.log(
      "🟢 WS connected:",
      socket.id,
      "transport=",
      socket.conn.transport.name
    );

    // ✅ LOG EVERY EVENT FROM CLIENT (super important)
    socket.onAny((event, ...args) => {
      console.log("📩 WS event:", event, "from", socket.id, "args=", args);
    });

    socket.on("join:project", (projectId) => {
      if (!projectId) return;
      const room = projectRoom(projectId);
      socket.join(room);
      console.log(`🟣 ${socket.id} joined ${room}`);
      console.log("   rooms now:", [...socket.rooms]);
    });

    socket.on("join:user", (userId) => {
      if (!userId) return;
      const room = userRoom(userId);
      socket.join(room);
      console.log(`🔵 ${socket.id} joined ${room}`);
    });

    socket.on("leave:project", (projectId) => {
      if (!projectId) return;
      const room = projectRoom(projectId);
      socket.leave(room);
      console.log(`🟡 ${socket.id} left ${room}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 WS disconnected:", socket.id, "reason=", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("🔥 WS connect_error:", socket.id, err?.message);
    });

    planEvents.registerSocketHandlers(io, socket);
  });

  console.log("✅ WebSocket initialized");
  return io;
}

module.exports = { initWebSocket };
