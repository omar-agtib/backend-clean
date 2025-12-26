const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MilestoneSchema = new mongoose.Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true, index: true },

    name: { type: String, required: true, trim: true },

    progress: { type: Number, default: 0, min: 0, max: 100 },

    completed: { type: Boolean, default: false, index: true },

    // Audit
    createdBy: { type: ObjectId, ref: "User" },
    updatedBy: { type: ObjectId, ref: "User" },

    // Soft delete (like plans)
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
    deletedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

MilestoneSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model("Milestone", MilestoneSchema);
