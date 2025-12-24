const router = require("express").Router();

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
  res.json({ status: "ok", uptime: process.uptime() });
});

module.exports = router;
