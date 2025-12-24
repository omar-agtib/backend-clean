const asyncHandler = require("express-async-handler");
const Tool = require("./tool.model");
const service = require("./tool.service");

exports.getTools = asyncHandler(async (req, res) => {
  res.json(await Tool.find());
});

exports.assignTool = asyncHandler(async (req, res) => {
  const { toolId, projectId } = req.body;
  const assignment = await service.assignTool(toolId, req.user.id, projectId);
  res.json(assignment);
});

exports.returnTool = asyncHandler(async (req, res) => {
  const { toolId } = req.body;
  const tool = await service.returnTool(toolId);
  res.json(tool);
});
