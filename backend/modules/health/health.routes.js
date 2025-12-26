// modules/health/health.routes.js
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: System
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is running
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    // version: process.env.APP_VERSION || "dev",
    // env: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
