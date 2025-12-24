const router = require("express").Router();
const ctrl = require("./project.controller");
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");

/**
 * @swagger
 * tags:
 *   name: Projects
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 */
router.post("/", auth, ctrl.create);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List my projects
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", auth, ctrl.listMine);

/**
 * @swagger
 * /api/projects/{projectId}/members:
 *   post:
 *     summary: Add project member
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 */
router.post(
  "/:projectId/members",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.addMember
);

/**
 * @swagger
 * /api/projects/{projectId}/members:
 *   delete:
 *     summary: Remove project member
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 */
router.delete(
  "/:projectId/members",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.removeMember
);

module.exports = router;
