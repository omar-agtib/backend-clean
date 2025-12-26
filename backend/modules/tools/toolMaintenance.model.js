const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ToolMaintenanceSchema = new mongoose.Schema(
  {
    toolId: { type: ObjectId, ref: "Tool", required: true, index: true },
    projectId: { type: ObjectId, ref: "Project", required: true, index: true },

    description: { type: String, required: true },

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },

    startedBy: { type: ObjectId, ref: "User", required: true },
    completedBy: { type: ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

ToolMaintenanceSchema.index({ toolId: 1, completedAt: 1 });

module.exports = mongoose.model("ToolMaintenance", ToolMaintenanceSchema);
