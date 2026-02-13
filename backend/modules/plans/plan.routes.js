const router = require("express").Router();

const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

const projectAccess = require("../../middlewares/projectAccess");
const planAccess = require("../../middlewares/planAccess");
const planVersionAccess = require("../../middlewares/planVersionAccess");

const ctrl = require("./plan.controller");

/**
 * Plans
 */

// Create plan
router.post("/", auth, projectAccess(["PROJECT_MANAGER"]), ctrl.create);

// List plans by project
router.get("/project/:projectId", auth, projectAccess(), ctrl.listByProject);

/**
 * Plan Versions (put these BEFORE "/:planId/..." to avoid future collisions)
 */

// Delete version (soft delete + lock if used)
router.delete(
  "/versions/:versionId",
  auth,
  planVersionAccess(["PROJECT_MANAGER"]),
  ctrl.deleteVersion,
);

// Restore version (must be able to load deleted docs)
router.post(
  "/versions/:versionId/restore",
  auth,
  planVersionAccess(["PROJECT_MANAGER"], { includeDeleted: true }),
  ctrl.restoreVersion,
);

// Rollback / set as current
router.post(
  "/versions/:versionId/set-current",
  auth,
  planVersionAccess(["PROJECT_MANAGER"]),
  ctrl.setCurrentVersion,
);

// Signed URL (secure download) — choose who can access it
router.get(
  "/versions/:versionId/signed-url",
  auth,
  planVersionAccess(["PROJECT_MANAGER", "TEAM_LEADER", "QUALITY"]),
  ctrl.signedUrl,
);

/**
 * Plan-specific routes
 */

// ✅ ADD THIS - Get single plan
router.get("/:planId", auth, planAccess(), ctrl.getOne);

// List versions of a plan
router.get("/:planId/versions", auth, planAccess(), ctrl.listVersions);

// Upload + create version
router.post(
  "/:planId/versions/upload",
  auth,
  planAccess(["PROJECT_MANAGER"]),
  upload.single("file"),
  ctrl.uploadVersion,
);

module.exports = router;
