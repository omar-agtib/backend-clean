// modules/dashboard/dashboard.service.js
const mongoose = require("mongoose");
const Project = require("../projects/project.model");
const NC = require("../nonConformity/nc.model");
const Milestone = require("../progress/milestone.model");
const StockItem = require("../stock/stockItem.model");
const Tool = require("../tools/tool.model");
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

  return id;
}

/**
 * ✅ Existing: project dashboard
 */
exports.getProjectDashboard = async (projectId) => {
  const pid = asObjectId(projectId, "projectId");

  const [
    totalNCs,
    openNCs,
    inProgressNCs,
    validatedNCs,
    lastNC,
    milestonesTotal,
    milestonesCompleted,
    lastMilestone,
    stockAgg,
    assignedTools,
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    invoicesAgg,
    invoicesAmountAgg,
  ] = await Promise.all([
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
    Milestone.countDocuments({ projectId: pid, isDeleted: false }),
    Milestone.countDocuments({
      projectId: pid,
      isDeleted: false,
      completed: true,
    }),
    Milestone.findOne({ projectId: pid, isDeleted: false })
      .sort({ updatedAt: -1 })
      .select("updatedAt"),
    StockItem.aggregate([
      { $match: { projectId: pid } },
      { $group: { _id: null, totalStockQty: { $sum: "$quantity" } } },
    ]),
    ToolAssignment.countDocuments({ projectId: pid, returnedAt: null }),
    Invoice.countDocuments({ projectId: pid }),
    Invoice.countDocuments({ projectId: pid, status: "PAID" }),
    Invoice.countDocuments({
      projectId: pid,
      status: { $in: ["DRAFT", "SENT"] },
    }),
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

/**
 * ✅ UPDATED: global dashboard overview for logged user
 */
exports.getUserOverview = async (userId) => {
  const uid = asObjectId(userId, "userId");

  const projects = await Project.find({
    isDeleted: false,
    $or: [{ owner: uid }, { "members.userId": uid }],
  })
    .select("_id name status updatedAt")
    .sort({ updatedAt: -1 });

  const projectIds = projects.map((p) => p._id);

  if (projectIds.length === 0) {
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      openNCRs: 0,
      totalTools: 0,
      toolsInUse: 0,
      totalStock: 0,
      lowStockItems: 0,
      totalBilling: 0,
      outstandingAmount: 0,
      totals: {
        ncTotal: 0,
        ncOpen: 0,
        ncInProgress: 0,
        ncValidated: 0,
        milestonesTotal: 0,
        milestonesCompleted: 0,
        milestonesCompletionRate: 0,
        stockTotalQty: 0,
        toolsAssigned: 0,
        invoicesTotal: 0,
        invoicesPaid: 0,
        invoicesUnpaid: 0,
      },
      invoicesByStatus: {
        DRAFT: { count: 0, totalAmount: 0 },
        SENT: { count: 0, totalAmount: 0 },
        PAID: { count: 0, totalAmount: 0 },
        CANCELLED: { count: 0, totalAmount: 0 },
      },
      projects: [],
    };
  }

  const [
    ncAgg,
    milestonesAgg,
    stockAgg,
    lowStockAgg,
    toolsTotal,
    toolsAssigned,
    invoicesCountAgg,
    invoicesByStatusAgg,
    invoicesAmountAgg,
  ] = await Promise.all([
    NC.aggregate([
      { $match: { projectId: { $in: projectIds }, isDeleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Milestone.aggregate([
      { $match: { projectId: { $in: projectIds }, isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
        },
      },
    ]),
    StockItem.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]),
    // ✅ Low stock items (quantity < minQuantity)
    StockItem.countDocuments({
      projectId: { $in: projectIds },
      $expr: { $lt: ["$quantity", "$minQuantity"] },
    }),
    // ✅ Total tools in inventory
    Tool.countDocuments({ isDeleted: false }),
    // ✅ Tools currently assigned
    ToolAssignment.countDocuments({
      projectId: { $in: projectIds },
      returnedAt: null,
    }),
    Invoice.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          paid: { $sum: { $cond: [{ $eq: ["$status", "PAID"] }, 1, 0] } },
          unpaid: {
            $sum: {
              $cond: [{ $in: ["$status", ["DRAFT", "SENT"]] }, 1, 0],
            },
          },
        },
      },
    ]),
    Invoice.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
    // ✅ Invoice amounts (total billing + outstanding)
    Invoice.aggregate([
      { $match: { projectId: { $in: projectIds } } },
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

  const ncMap = (ncAgg || []).reduce((acc, r) => {
    acc[r._id] = r.count;
    return acc;
  }, {});

  const ms = milestonesAgg?.[0] || { total: 0, completed: 0 };
  const stockTotalQty = stockAgg?.[0]?.totalQty || 0;
  const invCount = invoicesCountAgg?.[0] || { total: 0, paid: 0, unpaid: 0 };
  const amounts = invoicesAmountAgg?.[0] || {
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
  };

  const invoicesByStatus = (invoicesByStatusAgg || []).reduce((acc, r) => {
    acc[r._id] = { count: r.count, totalAmount: r.totalAmount };
    return acc;
  }, {});

  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED",
  ).length;

  const milestonesCompletionRate =
    ms.total === 0 ? 0 : Math.round((ms.completed / ms.total) * 100);

  // ✅ Return top-level properties for StatCard display
  return {
    // Top-level for StatCards
    totalProjects: projectIds.length,
    activeProjects,
    completedProjects: ms.completed || 0,
    openNCRs: ncMap.OPEN || 0,
    totalTools: toolsTotal,
    toolsInUse: toolsAssigned,
    totalStock: stockTotalQty,
    lowStockItems: lowStockAgg,
    totalBilling: amounts.totalAmount || 0,
    outstandingAmount: amounts.unpaidAmount || 0,

    // Detailed totals
    totals: {
      ncTotal:
        (ncMap.OPEN || 0) + (ncMap.IN_PROGRESS || 0) + (ncMap.VALIDATED || 0),
      ncOpen: ncMap.OPEN || 0,
      ncInProgress: ncMap.IN_PROGRESS || 0,
      ncValidated: ncMap.VALIDATED || 0,
      milestonesTotal: ms.total || 0,
      milestonesCompleted: ms.completed || 0,
      milestonesCompletionRate,
      stockTotalQty,
      toolsAssigned,
      invoicesTotal: invCount.total || 0,
      invoicesPaid: invCount.paid || 0,
      invoicesUnpaid: invCount.unpaid || 0,
    },

    invoicesByStatus: {
      DRAFT: invoicesByStatus.DRAFT || { count: 0, totalAmount: 0 },
      SENT: invoicesByStatus.SENT || { count: 0, totalAmount: 0 },
      PAID: invoicesByStatus.PAID || { count: 0, totalAmount: 0 },
      CANCELLED: invoicesByStatus.CANCELLED || { count: 0, totalAmount: 0 },
    },

    projects: projects.map((p) => ({
      _id: String(p._id),
      name: p.name,
      status: p.status,
      updatedAt: p.updatedAt,
    })),
  };
};
