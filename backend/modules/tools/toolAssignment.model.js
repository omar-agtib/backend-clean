const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ToolAssignmentSchema = new mongoose.Schema({
  toolId: { type: ObjectId, ref: "Tool", required: true },
  assignedTo: { type: ObjectId, ref: "User", required: true },
  projectId: { type: ObjectId, ref: "Project" },
  assignedAt: { type: Date, default: Date.now },
  returnedAt: Date,
});

module.exports = mongoose.model("ToolAssignment", ToolAssignmentSchema);
