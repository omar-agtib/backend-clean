// modules/stock/stock.routes.js
const router = require("express").Router();
const ctrl = require("./stock.controller");
const auth = require("../../middlewares/auth");
const projectAccess = require("../../middlewares/projectAccess");
const stockAccess = require("../../middlewares/stockAccess");

// Create a stock item for project
router.post(
  "/items",
  auth,
  projectAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.createItem
);

// List stock items for a project
router.get("/project/:projectId", auth, projectAccess(), ctrl.getByProject);

// List movements for a project
router.get(
  "/project/:projectId/movements",
  auth,
  projectAccess(),
  ctrl.getMovementsByProject
);

// ✅ Get one stock item
router.get(
  "/items/:stockItemId",
  auth,
  stockAccess(), // checks membership via stockItem.projectId
  ctrl.getOne
);

// ✅ Movements for one stock item
router.get(
  "/items/:stockItemId/movements",
  auth,
  stockAccess(),
  ctrl.getMovementsByStockItem
);

// Adjust stock (IN / OUT)
router.post(
  "/adjust",
  auth,
  stockAccess(["PROJECT_MANAGER", "TEAM_LEADER"]),
  ctrl.adjustStock
);

module.exports = router;
