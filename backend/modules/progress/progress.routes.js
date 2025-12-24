const router = require("express").Router();
const ctrl = require("./progress.controller");
const auth = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Progress
 */

/**
 * @swagger
 * /api/progress/{projectId}:
 *   get:
 *     summary: Get project milestones
 *     tags: [Progress]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/:projectId", auth, ctrl.list);

/**
 * @swagger
 * /api/progress/milestone/{milestoneId}:
 *   patch:
 *     summary: Update milestone progress
 *     tags: [Progress]
 *     security: [{ bearerAuth: [] }]
 */
router.patch("/milestone/:milestoneId", auth, ctrl.update);

module.exports = router;
