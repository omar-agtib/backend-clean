// modules/billing/billing.routes.js
const router = require("express").Router();
const ctrl = require("./billing.controller");
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const invoiceAccess = require("../../middlewares/invoiceAccess");

/**
 * POST /api/billing
 */
router.post("/", auth, projectAccess(["PROJECT_MANAGER"]), ctrl.create);

/**
 * ✅ GET /api/billing/project/:projectId/summary
 */
router.get("/project/:projectId/summary", auth, projectAccess(), ctrl.summary);

/**
 * GET /api/billing/project/:projectId
 */
router.get("/project/:projectId", auth, projectAccess(), ctrl.listByProject);

/**
 * GET /api/billing/:invoiceId
 */
router.get("/:invoiceId", auth, invoiceAccess(), ctrl.getOne);

/**
 * POST /api/billing/:invoiceId/pay
 */
router.post(
  "/:invoiceId/pay",
  auth,
  invoiceAccess(["PROJECT_MANAGER"]),
  ctrl.markPaid
);

/**
 * ✅ POST /api/billing/:invoiceId/cancel
 */
router.post(
  "/:invoiceId/cancel",
  auth,
  invoiceAccess(["PROJECT_MANAGER"]),
  ctrl.cancel
);

module.exports = router;
