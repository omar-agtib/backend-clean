const Project = require("../projects/project.model");
const NC = require("../nonConformity/nc.model");
const Milestone = require("../progress/milestone.model");
const StockItem = require("../stock/stockItem.model");
const Tool = require("../tools/tool.model");
const Invoice = require("../billing/invoice.model");

exports.getProjectDashboard = async (projectId) => {
  const totalNCs = await NC.countDocuments({ projectId, isDeleted: false });
  const openNCs = await NC.countDocuments({ projectId, status: "OPEN" });
  const inProgressNCs = await NC.countDocuments({
    projectId,
    status: "IN_PROGRESS",
  });
  const validatedNCs = await NC.countDocuments({
    projectId,
    status: "VALIDATED",
  });

  const milestones = await Milestone.find({ projectId, isDeleted: false });
  const milestonesCompleted = milestones.filter(
    (m) => m.status === "DONE"
  ).length;

  const stockItems = await StockItem.find({ projectId });
  const totalStockQty = stockItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const tools = await Tool.find();
  const assignedTools = tools.filter((t) => t.status === "ASSIGNED").length;

  const invoices = await Invoice.find({ projectId });
  const paidInvoices = invoices.filter((i) => i.status === "PAID").length;

  return {
    totalNCs,
    openNCs,
    inProgressNCs,
    validatedNCs,
    milestonesTotal: milestones.length,
    milestonesCompleted,
    totalStockQty,
    assignedTools,
    totalInvoices: invoices.length,
    paidInvoices,
  };
};
