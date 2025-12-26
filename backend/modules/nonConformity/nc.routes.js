// modules/nonConformity/nc.routes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const ncAccess = require("../../middlewares/ncAccess");
const ctrl = require("./nc.controller");

// Create NC (projectId in body)
router.post(
  "/",
  auth,
  projectAccess(["QUALITY", "PROJECT_MANAGER"]),
  ctrl.create
);

// List by project
router.get("/project/:projectId", auth, projectAccess(), ctrl.list);

// Assign (projectId derived from ncId)
router.post("/:ncId/assign", auth, ncAccess(["PROJECT_MANAGER"]), ctrl.assign);

// Change status (projectId derived from ncId)
router.post("/:ncId/status", auth, ncAccess(["QUALITY"]), ctrl.changeStatus);

// ✅ History timeline
router.get("/:ncId/history", auth, ncAccess(), ctrl.history);

module.exports = router;
