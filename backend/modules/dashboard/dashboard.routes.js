// modules/dashboard/dashboard.routes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const ctrl = require("./dashboard.controller");

/**
 * GET /api/dashboard/project/:projectId
 * Project dashboard KPIs
 */
router.get(
  "/project/:projectId",
  auth,
  projectAccess(),
  ctrl.getProjectDashboard
);

module.exports = router;
