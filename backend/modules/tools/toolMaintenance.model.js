const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ToolMaintenanceSchema = new mongoose.Schema({
  toolId: { type: ObjectId, ref: "Tool", required: true },
  description: String,
  startedAt: Date,
  completedAt: Date,
});

module.exports = mongoose.model("ToolMaintenance", ToolMaintenanceSchema);
