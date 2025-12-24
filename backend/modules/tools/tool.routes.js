const router = require("express").Router();
const ctrl = require("./tool.controller");
const auth = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Tools
 */

/**
 * @swagger
 * /api/tools:
 *   get:
 *     summary: List all tools
 *     tags: [Tools]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", auth, ctrl.getTools);

/**
 * @swagger
 * /api/tools/assign:
 *   post:
 *     summary: Assign a tool to a user/project
 *     tags: [Tools]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toolId
 *             properties:
 *               toolId:
 *                 type: string
 *               projectId:
 *                 type: string
 */
router.post("/assign", auth, ctrl.assignTool);

/**
 * @swagger
 * /api/tools/return:
 *   post:
 *     summary: Return an assigned tool
 *     tags: [Tools]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toolId
 *             properties:
 *               toolId:
 *                 type: string
 */
router.post("/return", auth, ctrl.returnTool);

module.exports = router;
