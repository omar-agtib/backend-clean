const asyncHandler = require("express-async-handler");
const Invoice = require("./invoice.model");
const service = require("./billing.service");

exports.list = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find().populate("projectId");
  res.json(invoices);
});

exports.create = asyncHandler(async (req, res) => {
  const { projectId, amount } = req.body;
  const invoice = await service.createInvoice(projectId, amount);
  res.json(invoice);
});

exports.markPaid = asyncHandler(async (req, res) => {
  const invoice = await service.markPaid(req.params.invoiceId);
  res.json(invoice);
});
