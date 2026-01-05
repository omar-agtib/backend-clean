// modules/dashboard/dashboard.service.js
const mongoose = require("mongoose");
const Project = require("../projects/project.model");

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

  return id;
}

/**
 * ✅ Existing: project dashboard
 */
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

/**
 * ✅ NEW: global dashboard overview for logged user
 * Aggregates across ALL projects where user is owner or member.
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

  // If user has no projects
  if (projectIds.length === 0) {
    return {
      totals: {
        projects: 0,
        ncTotal: 0,
        ncOpen: 0,
        ncInProgress: 0,
        ncValidated: 0,
        stockTotalQty: 0,
        toolsAssigned: 0,
        invoicesTotal: 0,
        invoicesPaid: 0,
        invoicesUnpaid: 0,
        milestonesTotal: 0,
        milestonesCompleted: 0,
        milestonesCompletionRate: 0,
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

  // --- GLOBAL TOTALS ---
  const [
    // NC global counts
    ncAgg,
    // milestones global
    milestonesAgg,
    // stock global
    stockAgg,
    // tools global
    toolsAssigned,
    // invoices global
    invoicesCountAgg,
    invoicesByStatusAgg,
  ] = await Promise.all([
    // NC grouped by status (global)
    NC.aggregate([
      { $match: { projectId: { $in: projectIds }, isDeleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Milestones total/completed (global)
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

    // Stock total qty (global)
    StockItem.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]),

    // Tools assigned (global) — active only
    ToolAssignment.countDocuments({
      projectId: { $in: projectIds },
      returnedAt: null,
    }),

    // Invoices total/paid/unpaid (global)
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

    // Invoices by status count + totalAmount (global)
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
  ]);

  const ncMap = (ncAgg || []).reduce((acc, r) => {
    acc[r._id] = r.count;
    return acc;
  }, {});

  const ms = milestonesAgg?.[0] || { total: 0, completed: 0 };
  const stockTotalQty = stockAgg?.[0]?.totalQty || 0;

  const invCount = invoicesCountAgg?.[0] || { total: 0, paid: 0, unpaid: 0 };

  const invoicesByStatus = (invoicesByStatusAgg || []).reduce((acc, r) => {
    acc[r._id] = { count: r.count, totalAmount: r.totalAmount };
    return acc;
  }, {});

  // --- PER PROJECT CARDS (lightweight) ---
  // NC by project
  const ncByProject = await NC.aggregate([
    { $match: { projectId: { $in: projectIds }, isDeleted: false } },
    {
      $group: {
        _id: { projectId: "$projectId", status: "$status" },
        count: { $sum: 1 },
      },
    },
  ]);

  const msByProject = await Milestone.aggregate([
    { $match: { projectId: { $in: projectIds }, isDeleted: false } },
    {
      $group: {
        _id: "$projectId",
        total: { $sum: 1 },
        completed: { $sum: { $cond: ["$completed", 1, 0] } },
      },
    },
  ]);

  const stockByProject = await StockItem.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    { $group: { _id: "$projectId", totalQty: { $sum: "$quantity" } } },
  ]);

  const toolsByProject = await ToolAssignment.aggregate([
    { $match: { projectId: { $in: projectIds }, returnedAt: null } },
    { $group: { _id: "$projectId", assigned: { $sum: 1 } } },
  ]);

  const invoicesByProject = await Invoice.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    {
      $group: {
        _id: { projectId: "$projectId", status: "$status" },
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const perProject = projects.map((p) => {
    const pid = String(p._id);

    const nc = { OPEN: 0, IN_PROGRESS: 0, VALIDATED: 0, total: 0 };
    ncByProject
      .filter((r) => String(r._id.projectId) === pid)
      .forEach((r) => {
        nc[r._id.status] = r.count;
        nc.total += r.count;
      });

    const msRow = msByProject.find((r) => String(r._id) === pid) || {
      total: 0,
      completed: 0,
    };

    const completionRate =
      msRow.total === 0 ? 0 : Math.round((msRow.completed / msRow.total) * 100);

    const stockRow = stockByProject.find((r) => String(r._id) === pid);
    const toolsRow = toolsByProject.find((r) => String(r._id) === pid);

    const invRows = invoicesByProject.filter(
      (r) => String(r._id.projectId) === pid
    );

    const inv = {
      total: invRows.reduce((s, r) => s + r.count, 0),
      paid: invRows
        .filter((r) => r._id.status === "PAID")
        .reduce((s, r) => s + r.count, 0),
      unpaid: invRows
        .filter((r) => r._id.status === "DRAFT" || r._id.status === "SENT")
        .reduce((s, r) => s + r.count, 0),
      totalAmount: invRows.reduce((s, r) => s + (r.totalAmount || 0), 0),
    };

    return {
      _id: pid,
      name: p.name,
      status: p.status,
      nc: {
        total: nc.total,
        open: nc.OPEN,
        inProgress: nc.IN_PROGRESS,
        validated: nc.VALIDATED,
      },
      milestones: {
        total: msRow.total,
        completed: msRow.completed,
        completionRate,
      },
      stock: {
        totalQty: stockRow?.totalQty || 0,
      },
      tools: {
        assigned: toolsRow?.assigned || 0,
      },
      invoices: {
        total: inv.total,
        paid: inv.paid,
        unpaid: inv.unpaid,
        totalAmount: inv.totalAmount,
      },
    };
  });

  const milestonesCompletionRate =
    ms.total === 0 ? 0 : Math.round((ms.completed / ms.total) * 100);

  return {
    totals: {
      projects: projectIds.length,

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

    projects: perProject,
  };
};
