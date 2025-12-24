const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MilestoneSchema = new mongoose.Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    progress: { type: Number, default: 0 }, // %
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", MilestoneSchema);
