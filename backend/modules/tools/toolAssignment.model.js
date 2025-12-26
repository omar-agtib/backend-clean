const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ToolAssignmentSchema = new mongoose.Schema(
  {
    toolId: { type: ObjectId, ref: "Tool", required: true, index: true },

    projectId: { type: ObjectId, ref: "Project", required: true, index: true },

    assignedTo: { type: ObjectId, ref: "User", required: true },
    assignedBy: { type: ObjectId, ref: "User", required: true },

    assignedAt: { type: Date, default: Date.now },

    returnedAt: { type: Date, default: null },
    returnedBy: { type: ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

ToolAssignmentSchema.index({ toolId: 1, returnedAt: 1 });

module.exports = mongoose.model("ToolAssignment", ToolAssignmentSchema);
