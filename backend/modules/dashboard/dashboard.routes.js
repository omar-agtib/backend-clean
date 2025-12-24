const router = require("express").Router();
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const ctrl = require("./dashboard.controller");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 */

router.get(
  "/project/:projectId",
  auth,
  projectAccess(),
  ctrl.getProjectDashboard
);

module.exports = router;
