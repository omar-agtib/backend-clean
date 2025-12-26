// modules/projects/project.routes.js
const router = require("express").Router();
const ctrl = require("./project.controller");
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");

/**
 * @swagger
 * tags:
 *   name: Projects
 */

// Create project
router.post("/", auth, ctrl.create);

// List my projects
router.get("/", auth, ctrl.listMine);

// Get one project
router.get("/:projectId", auth, projectAccess(), ctrl.getOne);

// Update project (only managers)
router.patch(
  "/:projectId",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.update
);

// Soft delete project (only managers)
router.delete(
  "/:projectId",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.remove
);

// Add member
router.post(
  "/:projectId/members",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.addMember
);

// Remove member
router.delete(
  "/:projectId/members",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.removeMember
);

module.exports = router;
