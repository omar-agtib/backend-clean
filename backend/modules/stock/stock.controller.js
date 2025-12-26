// modules/stock/stock.controller.js
const asyncHandler = require("express-async-handler");
const service = require("./stock.service");

exports.createItem = asyncHandler(async (req, res) => {
  const { projectId, productId, quantity, location } = req.body;

  const item = await service.createStockItem(
    projectId,
    productId,
    quantity ?? 0,
    location
  );

  res.status(201).json(item);
});

exports.getByProject = asyncHandler(async (req, res) => {
  const stock = await service.listStockByProject(req.params.projectId);
  res.json(stock);
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await service.getStockItem(req.params.stockItemId);
  res.json(item);
});

exports.adjustStock = asyncHandler(async (req, res) => {
  const { type, quantity, reason } = req.body;

  const item = await service.adjustStock(
    req.stockItem._id,
    type,
    quantity,
    req.user.id,
    reason
  );

  res.json(item);
});

exports.getMovementsByProject = asyncHandler(async (req, res) => {
  const movements = await service.listMovementsByProject(req.params.projectId);
  res.json(movements);
});

exports.getMovementsByStockItem = asyncHandler(async (req, res) => {
  const movements = await service.listMovementsByStockItem(
    req.params.stockItemId
  );
  res.json(movements);
});
