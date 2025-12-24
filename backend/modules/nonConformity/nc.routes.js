const router = require("express").Router();
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const ctrl = require("./nc.controller");

/**
 * @swagger
 * tags:
 *   name: Non-Conformities
 */

router.post(
  "/",
  auth,
  projectAccess(["QUALITY", "PROJECT_MANAGER"]),
  ctrl.create
);

router.get("/project/:projectId", auth, projectAccess(), ctrl.list);

router.post(
  "/:ncId/assign",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.assign
);

router.post(
  "/:ncId/status",
  auth,
  projectAccess(["QUALITY"]),
  ctrl.changeStatus
);

module.exports = router;
