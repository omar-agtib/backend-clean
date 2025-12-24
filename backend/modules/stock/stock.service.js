const StockItem = require("./stockItem.model");
const StockMovement = require("./stockMovement.model");
const stockEvents = require("../../ws/stockEvents"); // WS events for stock

/**
 * Adjust stock quantity
 * @param {string} stockItemId
 * @param {"IN"|"OUT"} type
 * @param {number} quantity
 * @param {string} userId
 * @param {string} reason
 */
async function adjustStock(stockItemId, type, quantity, userId, reason) {
  if (!["IN", "OUT"].includes(type)) throw new Error("Invalid adjustment type");
  if (quantity <= 0) throw new Error("Quantity must be positive");

  const item = await StockItem.findById(stockItemId);
  if (!item) throw new Error("Stock item not found");

  if (type === "OUT" && item.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  item.quantity += type === "IN" ? quantity : -quantity;
  await item.save();

  const movement = await StockMovement.create({
    stockItemId,
    type,
    quantity,
    reason,
    userId,
  });

  // Emit WS event: stock updated
  stockEvents.stockUpdated(item.projectId, item);
  stockEvents.stockMovementRecorded(item.projectId, movement);

  return item;
}

/**
 * List all stock items for a project
 * @param {string} projectId
 */
async function listStockByProject(projectId) {
  return StockItem.find({ projectId }).sort({ name: 1 });
}

module.exports = {
  adjustStock,
  listStockByProject,
};
