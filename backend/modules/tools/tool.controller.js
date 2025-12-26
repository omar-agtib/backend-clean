// modules/tools/tool.controller.js
const asyncHandler = require("express-async-handler");
const service = require("./tool.service");

/**
 * POST /api/tools
 * Create tool (inventory)
 */
exports.createTool = asyncHandler(async (req, res) => {
  const tool = await service.createTool(req.body);
  res.status(201).json(tool);
});

/**
 * GET /api/tools
 * List all tools (inventory)
 */
exports.getTools = asyncHandler(async (req, res) => {
  const tools = await service.listTools();
  res.json(tools);
});

/**
 * GET /api/tools/available
 * List available tools (inventory)
 */
exports.getAvailableTools = asyncHandler(async (req, res) => {
  const tools = await service.listAvailableTools();
  res.json(tools);
});

/**
 * POST /api/tools/assign
 * Body: { toolId, projectId, assignedTo }
 * projectAccess ensures membership via projectId in body
 */
exports.assignTool = asyncHandler(async (req, res) => {
  const assignment = await service.assignTool(req.body, req.user.id);
  res.status(201).json(assignment);
});

/**
 * POST /api/tools/return
 * Body: { toolId }
 * toolAccess derives projectId from active assignment (returnedAt=null)
 * and ensures membership/role
 */
exports.returnTool = asyncHandler(async (req, res) => {
  const toolId = req.tool?._id || req.body.toolId;

  const result = await service.returnTool({ toolId }, req.user.id);
  res.json(result);
});

/**
 * POST /api/tools/maintenance/start
 * Body: { toolId, projectId, description }
 * projectAccess ensures membership via projectId in body
 */
exports.startMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await service.startMaintenance(req.body, req.user.id);
  res.status(201).json(maintenance);
});

/**
 * POST /api/tools/maintenance/complete
 * Body: { maintenanceId }
 * maintenanceAccess derives projectId from maintenance record
 */
exports.completeMaintenance = asyncHandler(async (req, res) => {
  const maintenanceId = req.maintenance?._id || req.body.maintenanceId;

  const result = await service.completeMaintenance(
    { maintenanceId },
    req.user.id
  );
  res.json(result);
});

/**
 * GET /api/tools/project/:projectId/assignments
 * Full assignment history for project
 */
exports.listAssignmentsByProject = asyncHandler(async (req, res) => {
  const list = await service.listAssignmentsByProject(req.params.projectId);
  res.json(list);
});

/**
 * GET /api/tools/project/:projectId/assigned
 * Active only (returnedAt=null)
 */
exports.listActiveAssignedByProject = asyncHandler(async (req, res) => {
  const list = await service.listActiveAssignedByProject(req.params.projectId);
  res.json(list);
});

/**
 * GET /api/tools/project/:projectId/maintenance
 * Maintenance history for project
 */
exports.listMaintenanceByProject = asyncHandler(async (req, res) => {
  const list = await service.listMaintenanceByProject(req.params.projectId);
  res.json(list);
});
