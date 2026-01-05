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

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getAccessibleProjectIds(userId) {
  const uid = asObjectId(userId, "userId");

  const projects = await Project.find({
    isDeleted: false,
    $or: [{ owner: uid }, { "members.userId": uid }],
  }).select("_id");

  return projects.map((p) => p._id);
}

/**
 * GET /api/search?q=...
 * Scopes results to projects where user is owner/member
 */
async function searchAll({ userId, q, limit = 8 }) {
  const query = String(q || "").trim();
  if (!query) {
    return {
      q: "",
      totals: {
        projects: 0,
        nc: 0,
        milestones: 0,
        stock: 0,
        tools: 0,
        invoices: 0,
      },
      results: {
        projects: [],
        nc: [],
        milestones: [],
        stock: [],
        tools: [],
        invoices: [],
      },
    };
  }

  const projectIds = await getAccessibleProjectIds(userId);

  // No projects => no results
  if (projectIds.length === 0) {
    return {
      q: query,
      totals: {
        projects: 0,
        nc: 0,
        milestones: 0,
        stock: 0,
        tools: 0,
        invoices: 0,
      },
      results: {
        projects: [],
        nc: [],
        milestones: [],
        stock: [],
        tools: [],
        invoices: [],
      },
    };
  }

  const rx = new RegExp(escapeRegex(query), "i");
  const lim = Math.max(1, Math.min(20, Number(limit) || 8));

  // 1) Projects
  const projects = await Project.find({
    _id: { $in: projectIds },
    isDeleted: false,
    $or: [{ name: rx }, { description: rx }],
  })
    .select("_id name status description updatedAt")
    .sort({ updatedAt: -1 })
    .limit(lim);

  // 2) NC
  const nc = await NC.find({
    projectId: { $in: projectIds },
    isDeleted: false,
    $or: [{ title: rx }, { description: rx }],
  })
    .select("_id projectId title status updatedAt")
    .sort({ updatedAt: -1 })
    .limit(lim);

  // 3) Milestones
  const milestones = await Milestone.find({
    projectId: { $in: projectIds },
    isDeleted: false,
    name: rx,
  })
    .select("_id projectId name progress completed updatedAt")
    .sort({ updatedAt: -1 })
    .limit(lim);

  // 4) Stock (StockItem + product name if populated)
  const stockItems = await StockItem.find({
    projectId: { $in: projectIds },
  })
    .populate("productId")
    .sort({ updatedAt: -1 });

  const stock = stockItems
    .filter((it) => {
      const p = it.productId;
      const pname = typeof p === "object" && p ? String(p.name || "") : "";
      const loc = String(it.location || "");
      return rx.test(pname) || rx.test(loc);
    })
    .slice(0, lim)
    .map((it) => ({
      _id: String(it._id),
      projectId: String(it.projectId),
      quantity: Number(it.quantity || 0),
      location: it.location || "",
      product:
        it.productId && typeof it.productId === "object"
          ? {
              _id: String(it.productId._id),
              name: String(it.productId.name || ""),
            }
          : null,
      updatedAt: it.updatedAt,
    }));

  // 5) Tools (inventory + active assignments for accessible projects)
  // Tools themselves are global inventory, so we filter by:
  // - tool name match
  // - OR active assignment in a project you can access
  const toolsByName = await Tool.find({ name: rx })
    .select("_id name status serialNumber updatedAt")
    .sort({ updatedAt: -1 })
    .limit(lim);

  const activeAssignments = await ToolAssignment.find({
    projectId: { $in: projectIds },
    returnedAt: null,
  })
    .populate("toolId")
    .select("toolId projectId assignedTo assignedAt")
    .sort({ assignedAt: -1 });

  const toolsFromAssignments = activeAssignments
    .map((a) => a.toolId)
    .filter(Boolean)
    .filter((t) => rx.test(String(t.name || "")));

  // merge unique tools
  const toolMap = new Map();
  for (const t of toolsByName) toolMap.set(String(t._id), t);
  for (const t of toolsFromAssignments) toolMap.set(String(t._id), t);

  const tools = Array.from(toolMap.values())
    .slice(0, lim)
    .map((t) => ({
      _id: String(t._id),
      name: String(t.name || ""),
      status: String(t.status || ""),
      serialNumber: t.serialNumber || null,
      updatedAt: t.updatedAt,
    }));

  // 6) Invoices
  const invoices = await Invoice.find({
    projectId: { $in: projectIds },
    $or: [{ number: rx }, { status: rx }],
  })
    .select("_id projectId number amount status issuedAt createdAt")
    .sort({ createdAt: -1 })
    .limit(lim);

  return {
    q: query,
    totals: {
      projects: projects.length,
      nc: nc.length,
      milestones: milestones.length,
      stock: stock.length,
      tools: tools.length,
      invoices: invoices.length,
    },
    results: {
      projects: projects.map((p) => ({
        _id: String(p._id),
        name: p.name,
        status: p.status,
        description: p.description || "",
        updatedAt: p.updatedAt,
      })),
      nc: nc.map((x) => ({
        _id: String(x._id),
        projectId: String(x.projectId),
        title: x.title,
        status: x.status,
        updatedAt: x.updatedAt,
      })),
      milestones: milestones.map((m) => ({
        _id: String(m._id),
        projectId: String(m.projectId),
        name: m.name,
        progress: m.progress,
        completed: m.completed,
        updatedAt: m.updatedAt,
      })),
      stock,
      tools,
      invoices: invoices.map((inv) => ({
        _id: String(inv._id),
        projectId: String(inv.projectId),
        number: inv.number,
        amount: inv.amount,
        status: inv.status,
        issuedAt: inv.issuedAt,
        createdAt: inv.createdAt,
      })),
    },
  };
}

module.exports = { searchAll };
