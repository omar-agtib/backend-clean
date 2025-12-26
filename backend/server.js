// backend/server.js
require("dotenv").config();
const http = require("http");

// App
const app = require("./app");

// Config
const { port, mongoUri } = require("./config/env");
const logger = require("./config/logger");

// DB
const connectDb = require("./config/db");

// WS
const { initWebSocket } = require("./ws");

let server;

async function startServer() {
  try {
    await connectDb(mongoUri);

    server = http.createServer(app);

    initWebSocket(server);

    server.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📘 Swagger: http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    logger.error("❌ Server failed to start", {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

async function shutdown(signal) {
  try {
    logger.warn(`🛑 Received ${signal}, shutting down...`);

    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info("HTTP server closed");
    }

    const mongoose = require("mongoose");
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");

    process.exit(0);
  } catch (err) {
    logger.error("Shutdown error", { message: err.message });
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
