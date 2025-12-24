const asyncHandler = require("express-async-handler");
const StockItem = require("./stockItem.model");
const { adjustStock } = require("./stock.service");

exports.getStock = asyncHandler(async (req, res) => {
  const stock = await StockItem.find().populate("productId");
  res.json(stock);
});

exports.adjustStock = asyncHandler(async (req, res) => {
  const { stockItemId, type, quantity, reason } = req.body;

  const item = await adjustStock(
    stockItemId,
    type,
    quantity,
    req.user.id,
    reason
  );

  res.json(item);
});
