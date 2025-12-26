// modules/tools/tool.routes.js
const router = require("express").Router();
const ctrl = require("./tool.controller");
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const toolAccess = require("../../middlewares/toolAccess");
const maintenanceAccess = require("../../middlewares/maintenanceAccess");

/**
 * Inventory
 */
router.post("/", auth, ctrl.createTool);
router.get("/", auth, ctrl.getTools);

/**
 * A) Available tools (inventory)
 */
router.get("/available", auth, ctrl.getAvailableTools);

/**
 * Assign (projectId is required to create relation)
 */
router.post(
  "/assign",
  auth,
  projectAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.assignTool
);

/**
 * Return (project derived from active assignment)
 */
router.post(
  "/return",
  auth,
  toolAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.returnTool
);

/**
 * Maintenance start (projectId required to create record)
 */
router.post(
  "/maintenance/start",
  auth,
  projectAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.startMaintenance
);

/**
 * Maintenance complete (project derived from maintenanceId)
 */
router.post(
  "/maintenance/complete",
  auth,
  maintenanceAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.completeMaintenance
);

/**
 * Project history (all assignments)
 */
router.get(
  "/project/:projectId/assignments",
  auth,
  projectAccess(),
  ctrl.listAssignmentsByProject
);

/**
 * B) Project active assignments only
 */
router.get(
  "/project/:projectId/assigned",
  auth,
  projectAccess(),
  ctrl.listActiveAssignedByProject
);

/**
 * C) Project maintenance history
 */
router.get(
  "/project/:projectId/maintenance",
  auth,
  projectAccess(),
  ctrl.listMaintenanceByProject
);

module.exports = router;
