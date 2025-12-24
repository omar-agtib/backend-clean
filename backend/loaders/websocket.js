const { Server } = require("socket.io");
const planEvents = require("../ws/planEvents");

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    // TODO: socket auth in Phase 9
    planEvents(io, socket);
  });
};
