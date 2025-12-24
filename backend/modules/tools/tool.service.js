const Tool = require("./tool.model");
const ToolAssignment = require("./toolAssignment.model");
const toolEvents = require("../../ws/toolEvents"); // WebSocket events

/**
 * Assign a tool to a user/project
 * @param {string} toolId
 * @param {string} userId
 * @param {string} projectId
 */
async function assignTool(toolId, userId, projectId) {
  const tool = await Tool.findById(toolId);
  if (!tool) throw new Error("Tool not found");
  if (tool.status === "ASSIGNED") throw new Error("Tool is already assigned");

  tool.status = "ASSIGNED";
  await tool.save();

  const assignment = await ToolAssignment.create({
    toolId,
    assignedTo: userId,
    projectId,
    assignedAt: new Date(),
    returnedAt: null,
  });

  // Emit WS event: tool assigned
  toolEvents.toolAssigned(projectId, tool, assignment);

  return assignment;
}

/**
 * Return a tool
 * @param {string} toolId
 */
async function returnTool(toolId) {
  const tool = await Tool.findById(toolId);
  if (!tool) throw new Error("Tool not found");
  if (tool.status !== "ASSIGNED")
    throw new Error("Tool is not currently assigned");

  tool.status = "AVAILABLE";
  await tool.save();

  const assignment = await ToolAssignment.findOneAndUpdate(
    { toolId, returnedAt: null },
    { returnedAt: new Date() },
    { new: true }
  );

  // Emit WS event: tool returned
  toolEvents.toolReturned(tool.projectId, tool, assignment);

  return tool;
}

/**
 * List all tools for a project
 * @param {string} projectId
 */
async function listTools(projectId) {
  return Tool.find({ projectId }).sort({ name: 1 });
}

module.exports = {
  assignTool,
  returnTool,
  listTools,
};
