// backend/modules/progress/progress.routes.js
const router = require("express").Router();
const ctrl = require("./progress.controller");
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const milestoneAccess = require("../../middlewares/milestoneAccess");

/**
 * ✅ GET /api/progress/project/:projectId/summary
 */
router.get("/project/:projectId/summary", auth, projectAccess(), ctrl.summary);

/**
 * ✅ GET /api/progress/project/:projectId
 */
router.get("/project/:projectId", auth, projectAccess(), ctrl.list);

/**
 * ✅ POST /api/progress
 * Body must include: projectId, name
 */
router.post(
  "/",
  auth,
  projectAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.create
);

/**
 * ✅ PATCH /api/progress/milestone/:milestoneId
 * Body: { progress }
 */
router.patch(
  "/milestone/:milestoneId",
  auth,
  milestoneAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.update
);

/**
 * ✅ DELETE /api/progress/milestone/:milestoneId
 */
router.delete(
  "/milestone/:milestoneId",
  auth,
  milestoneAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.remove
);

module.exports = router;
