// modules/billing/billing.controller.js
const asyncHandler = require("express-async-handler");
const service = require("./billing.service");

exports.listByProject = asyncHandler(async (req, res) => {
  const invoices = await service.listByProject(req.params.projectId);
  res.json(invoices);
});

exports.getOne = asyncHandler(async (req, res) => {
  const invoice = await service.getById(req.invoice._id);
  res.json(invoice);
});

exports.create = asyncHandler(async (req, res) => {
  const { projectId, amount } = req.body;
  const invoice = await service.createInvoice(projectId, amount, req.user.id);
  res.status(201).json(invoice);
});

exports.markPaid = asyncHandler(async (req, res) => {
  const invoice = await service.markPaid(req.invoice._id, req.user.id);
  res.json(invoice);
});

exports.cancel = asyncHandler(async (req, res) => {
  const invoice = await service.cancelInvoice(req.invoice._id, req.user.id);
  res.json(invoice);
});

/**
 * ✅ GET /api/billing/project/:projectId/summary
 */
exports.summary = asyncHandler(async (req, res) => {
  const summary = await service.summaryByProject(req.params.projectId);
  res.json(summary);
});
