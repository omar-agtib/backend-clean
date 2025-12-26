// modules/stock/stock.service.js
const mongoose = require("mongoose");
const StockItem = require("./stockItem.model");
const StockMovement = require("./stockMovement.model");
const stockEvents = require("../../ws/stockEvents");

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}
function notFound(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}

async function createStockItem(projectId, productId, quantity = 0, location) {
  if (!projectId) throw badRequest("projectId is required");
  if (!productId) throw badRequest("productId is required");

  if (!mongoose.isValidObjectId(projectId))
    throw badRequest("Invalid projectId");
  if (!mongoose.isValidObjectId(productId))
    throw badRequest("Invalid productId");

  const q = Number(quantity);
  if (Number.isNaN(q) || q < 0)
    throw badRequest("quantity must be a number >= 0");

  // idempotent create
  const existing = await StockItem.findOne({ projectId, productId });
  if (existing) {
    // optional: update location if sent
    if (location && location !== existing.location) {
      existing.location = location;
      await existing.save();
    }
    return existing;
  }

  return StockItem.create({
    projectId,
    productId,
    quantity: q,
    location,
  });
}

async function getStockItem(stockItemId) {
  if (!stockItemId) throw badRequest("stockItemId is required");
  if (!mongoose.isValidObjectId(stockItemId))
    throw badRequest("Invalid stockItemId");

  const item = await StockItem.findById(stockItemId).populate("productId");
  if (!item) throw notFound("Stock item not found");

  return item;
}

async function adjustStock(stockItemId, type, quantity, userId, reason) {
  if (!stockItemId) throw badRequest("stockItemId is required");
  if (!mongoose.isValidObjectId(stockItemId))
    throw badRequest("Invalid stockItemId");

  if (!["IN", "OUT"].includes(type)) {
    throw badRequest("Invalid adjustment type (must be IN or OUT)");
  }

  const q = Number(quantity);
  if (Number.isNaN(q) || q <= 0)
    throw badRequest("quantity must be a number > 0");

  const item = await StockItem.findById(stockItemId);
  if (!item) throw notFound("Stock item not found");

  if (type === "OUT" && item.quantity < q) {
    const err = new Error("Insufficient stock");
    err.status = 400;
    throw err;
  }

  item.quantity += type === "IN" ? q : -q;
  await item.save();

  const movement = await StockMovement.create({
    projectId: item.projectId,
    stockItemId,
    type,
    quantity: q,
    reason,
    userId,
  });

  stockEvents.stockUpdated(item.projectId, item);
  stockEvents.stockMovementRecorded(item.projectId, movement);

  return item;
}

async function listStockByProject(projectId) {
  if (!projectId) throw badRequest("projectId is required");
  if (!mongoose.isValidObjectId(projectId))
    throw badRequest("Invalid projectId");

  return StockItem.find({ projectId })
    .populate("productId")
    .sort({ updatedAt: -1 });
}

async function listMovementsByProject(projectId) {
  if (!projectId) throw badRequest("projectId is required");
  if (!mongoose.isValidObjectId(projectId))
    throw badRequest("Invalid projectId");

  return StockMovement.find({ projectId })
    .populate({
      path: "stockItemId",
      populate: { path: "productId" },
    })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });
}

async function listMovementsByStockItem(stockItemId) {
  if (!stockItemId) throw badRequest("stockItemId is required");
  if (!mongoose.isValidObjectId(stockItemId))
    throw badRequest("Invalid stockItemId");

  return StockMovement.find({ stockItemId })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });
}

module.exports = {
  createStockItem,
  getStockItem,
  adjustStock,
  listStockByProject,
  listMovementsByProject,
  listMovementsByStockItem,
};
