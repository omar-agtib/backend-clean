// modules/dashboard/dashboard.service.js
const mongoose = require("mongoose");
const NC = require("../nonConformity/nc.model");
const Milestone = require("../progress/milestone.model");
const StockItem = require("../stock/stockItem.model");
const ToolAssignment = require("../tools/toolAssignment.model");
const Invoice = require("../billing/invoice.model");

function asObjectId(id, name = "id") {
  if (!id) {
    const err = new Error(`${name} is required`);
    err.status = 400;
    throw err;
  }

  if (typeof id === "string") {
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error(`Invalid ${name}`);
      err.status = 400;
      throw err;
    }
    return new mongoose.Types.ObjectId(id);
  }

  return id; // already ObjectId
}

exports.getProjectDashboard = async (projectId) => {
  const pid = asObjectId(projectId, "projectId");

  const [
    // NC counts
    totalNCs,
    openNCs,
    inProgressNCs,
    validatedNCs,
    lastNC,

    // milestones
    milestonesTotal,
    milestonesCompleted,
    lastMilestone,

    // stock
    stockAgg,

    // tools
    assignedTools,

    // invoices counts
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    invoicesAgg,

    // invoices amounts
    invoicesAmountAgg,
  ] = await Promise.all([
    // NC
    NC.countDocuments({ projectId: pid, isDeleted: false }),
    NC.countDocuments({ projectId: pid, isDeleted: false, status: "OPEN" }),
    NC.countDocuments({
      projectId: pid,
      isDeleted: false,
      status: "IN_PROGRESS",
    }),
    NC.countDocuments({
      projectId: pid,
      isDeleted: false,
      status: "VALIDATED",
    }),
    NC.findOne({ projectId: pid, isDeleted: false })
      .sort({ updatedAt: -1 })
      .select("updatedAt"),

    // Milestones
    Milestone.countDocuments({ projectId: pid, isDeleted: false }),
    Milestone.countDocuments({
      projectId: pid,
      isDeleted: false,
      completed: true,
    }),
    Milestone.findOne({ projectId: pid, isDeleted: false })
      .sort({ updatedAt: -1 })
      .select("updatedAt"),

    // Stock total quantity
    StockItem.aggregate([
      { $match: { projectId: pid } },
      { $group: { _id: null, totalStockQty: { $sum: "$quantity" } } },
    ]),

    // Assigned tools for this project (active assignments only)
    ToolAssignment.countDocuments({ projectId: pid, returnedAt: null }),

    // invoices counts
    Invoice.countDocuments({ projectId: pid }),
    Invoice.countDocuments({ projectId: pid, status: "PAID" }),
    Invoice.countDocuments({
      projectId: pid,
      status: { $in: ["DRAFT", "SENT"] },
    }),

    // invoice totals by status (count + totalAmount)
    Invoice.aggregate([
      { $match: { projectId: pid } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),

    // overall invoice amounts (total / paid / unpaid)
    Invoice.aggregate([
      { $match: { projectId: pid } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          paidAmount: {
            $sum: { $cond: [{ $eq: ["$status", "PAID"] }, "$amount", 0] },
          },
          unpaidAmount: {
            $sum: {
              $cond: [{ $in: ["$status", ["DRAFT", "SENT"]] }, "$amount", 0],
            },
          },
        },
      },
    ]),
  ]);

  const totalStockQty = stockAgg?.[0]?.totalStockQty || 0;

  const invoicesByStatus = (invoicesAgg || []).reduce((acc, row) => {
    acc[row._id] = { count: row.count, totalAmount: row.totalAmount };
    return acc;
  }, {});

  const amountRow = invoicesAmountAgg?.[0] || {
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
  };

  return {
    projectId: String(pid),

    nc: {
      total: totalNCs,
      open: openNCs,
      inProgress: inProgressNCs,
      validated: validatedNCs,
      lastUpdatedAt: lastNC?.updatedAt || null,
    },

    milestones: {
      total: milestonesTotal,
      completed: milestonesCompleted,
      remaining: milestonesTotal - milestonesCompleted,
      completionRate:
        milestonesTotal === 0
          ? 0
          : Math.round((milestonesCompleted / milestonesTotal) * 100),
      lastUpdatedAt: lastMilestone?.updatedAt || null,
    },

    stock: {
      totalQty: totalStockQty,
    },

    tools: {
      assigned: assignedTools,
    },

    invoices: {
      total: totalInvoices,
      paid: paidInvoices,
      unpaid: unpaidInvoices,

      amounts: {
        totalAmount: amountRow.totalAmount || 0,
        paidAmount: amountRow.paidAmount || 0,
        unpaidAmount: amountRow.unpaidAmount || 0,
      },

      byStatus: {
        DRAFT: invoicesByStatus.DRAFT || { count: 0, totalAmount: 0 },
        SENT: invoicesByStatus.SENT || { count: 0, totalAmount: 0 },
        PAID: invoicesByStatus.PAID || { count: 0, totalAmount: 0 },
        CANCELLED: invoicesByStatus.CANCELLED || { count: 0, totalAmount: 0 },
      },
    },
  };
};
