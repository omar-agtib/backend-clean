const router = require("express").Router();
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const ctrl = require("./plan.controller");

/**
 * @swagger
 * tags:
 *   name: Plans
 */

router.post("/", auth, projectAccess(["PROJECT_MANAGER"]), ctrl.create);

router.post(
  "/:planId/versions",
  auth,
  projectAccess(["PROJECT_MANAGER"]),
  ctrl.addVersion
);

module.exports = router;
