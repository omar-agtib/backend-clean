require("dotenv").config();
const http = require("http");

// App
const app = require("./app");

// Config
const { port } = require("./config/env");

// Loaders
const connectDB = require("./loaders/mongoose");
const { initWebSocket } = require("./ws");

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Init WebSocket
    initWebSocket(server);

    // Start listening
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📘 Swagger: http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
}

startServer();
