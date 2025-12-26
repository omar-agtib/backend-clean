// modules/tools/tool.service.js
const Tool = require("./tool.model");
const ToolAssignment = require("./toolAssignment.model");
const ToolMaintenance = require("./toolMaintenance.model");
const toolEvents = require("../../ws/toolEvents");

// 🔔 Notifications
const notifyService = require("../notifications/notification.service");

/**
 * Create tool (inventory)
 */
async function createTool(data) {
  if (!data?.name) {
    const err = new Error("name is required");
    err.status = 400;
    throw err;
  }

  const tool = await Tool.create({
    name: data.name,
    serialNumber: data.serialNumber,
  });

  return tool;
}

/**
 * List all tools (inventory)
 */
async function listTools() {
  return Tool.find().sort({ name: 1 });
}

/**
 * A) List available tools (inventory)
 */
async function listAvailableTools() {
  return Tool.find({ status: "AVAILABLE" }).sort({ name: 1 });
}

/**
 * Assign tool to user/project
 */
async function assignTool({ toolId, projectId, assignedTo }, assignedBy) {
  if (!toolId || !projectId || !assignedTo) {
    const err = new Error("toolId, projectId, assignedTo are required");
    err.status = 400;
    throw err;
  }

  const tool = await Tool.findById(toolId);
  if (!tool) {
    const err = new Error("Tool not found");
    err.status = 404;
    throw err;
  }

  if (tool.status !== "AVAILABLE") {
    const err = new Error(`Tool not available (status=${tool.status})`);
    err.status = 400;
    throw err;
  }

  tool.status = "ASSIGNED";
  await tool.save();

  const assignment = await ToolAssignment.create({
    toolId,
    projectId,
    assignedTo,
    assignedBy,
    assignedAt: new Date(),
    returnedAt: null,
    returnedBy: null,
  });

  // ✅ WS event
  toolEvents.toolAssigned(projectId, { tool, assignment });

  // 🔔 Notify assigned user
  await notifyService.createAndEmit({
    userId: assignedTo,
    projectId,
    type: "TOOL_ASSIGNED",
    title: "Tool assigned to you",
    message: `Tool "${tool.name}" has been assigned to you.`,
    data: { toolId: tool._id, assignmentId: assignment._id, projectId },
  });

  return assignment;
}

/**
 * Return tool
 */
async function returnTool({ toolId }, returnedBy) {
  if (!toolId) {
    const err = new Error("toolId is required");
    err.status = 400;
    throw err;
  }

  const tool = await Tool.findById(toolId);
  if (!tool) {
    const err = new Error("Tool not found");
    err.status = 404;
    throw err;
  }

  const assignment = await ToolAssignment.findOne({
    toolId,
    returnedAt: null,
  });

  if (!assignment) {
    const err = new Error("No active assignment for this tool");
    err.status = 400;
    throw err;
  }

  tool.status = "AVAILABLE";
  await tool.save();

  assignment.returnedAt = new Date();
  assignment.returnedBy = returnedBy;
  await assignment.save();

  toolEvents.toolReturned(assignment.projectId, { tool, assignment });
  return { tool, assignment };
}

/**
 * Start maintenance (sets tool status MAINTENANCE)
 */
async function startMaintenance({ toolId, projectId, description }, userId) {
  if (!toolId || !projectId || !description) {
    const err = new Error("toolId, projectId, description are required");
    err.status = 400;
    throw err;
  }

  const tool = await Tool.findById(toolId);
  if (!tool) {
    const err = new Error("Tool not found");
    err.status = 404;
    throw err;
  }

  if (tool.status === "ASSIGNED") {
    const err = new Error("Cannot start maintenance while tool is assigned");
    err.status = 400;
    throw err;
  }

  tool.status = "MAINTENANCE";
  await tool.save();

  const maintenance = await ToolMaintenance.create({
    toolId,
    projectId,
    description,
    startedAt: new Date(),
    completedAt: null,
    startedBy: userId,
    completedBy: null,
  });

  toolEvents.toolMaintenanceStarted(projectId, { tool, maintenance });
  return maintenance;
}

/**
 * Complete maintenance (sets tool status AVAILABLE)
 */
async function completeMaintenance({ maintenanceId }, userId) {
  if (!maintenanceId) {
    const err = new Error("maintenanceId is required");
    err.status = 400;
    throw err;
  }

  const maintenance = await ToolMaintenance.findById(maintenanceId);
  if (!maintenance) {
    const err = new Error("Maintenance record not found");
    err.status = 404;
    throw err;
  }

  if (maintenance.completedAt) {
    const err = new Error("Maintenance already completed");
    err.status = 400;
    throw err;
  }

  maintenance.completedAt = new Date();
  maintenance.completedBy = userId;
  await maintenance.save();

  const tool = await Tool.findById(maintenance.toolId);
  if (tool) {
    tool.status = "AVAILABLE";
    await tool.save();
  }

  toolEvents.toolMaintenanceCompleted(maintenance.projectId, {
    tool,
    maintenance,
  });
  return { tool, maintenance };
}

/**
 * List all assignments for a project (history)
 */
async function listAssignmentsByProject(projectId) {
  if (!projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }

  return ToolAssignment.find({ projectId })
    .populate("toolId")
    .populate("assignedTo", "name email role")
    .populate("assignedBy", "name email role")
    .populate("returnedBy", "name email role")
    .sort({ createdAt: -1 });
}

/**
 * B) List active assigned tools for a project (returnedAt=null)
 */
async function listActiveAssignedByProject(projectId) {
  if (!projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }

  return ToolAssignment.find({ projectId, returnedAt: null })
    .populate("toolId")
    .populate("assignedTo", "name email role")
    .populate("assignedBy", "name email role")
    .sort({ assignedAt: -1 });
}

/**
 * C) Maintenance history for a project
 */
async function listMaintenanceByProject(projectId) {
  if (!projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }

  return ToolMaintenance.find({ projectId })
    .populate("toolId")
    .populate("startedBy", "name email role")
    .populate("completedBy", "name email role")
    .sort({ startedAt: -1 });
}

module.exports = {
  createTool,
  listTools,
  listAvailableTools,
  assignTool,
  returnTool,
  startMaintenance,
  completeMaintenance,
  listAssignmentsByProject,
  listActiveAssignedByProject,
  listMaintenanceByProject,
};
