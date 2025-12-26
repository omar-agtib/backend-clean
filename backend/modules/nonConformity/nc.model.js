// modules/nonConformity/nc.model.js
const mongoose = require("mongoose");

const NcSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "VALIDATED"],
      default: "OPEN",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    planVersionId: { type: mongoose.Schema.Types.ObjectId, ref: "PlanVersion" },
    annotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Annotation" },

    attachments: [String],

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ Indexes (single source of truth)
NcSchema.index({ projectId: 1, status: 1 });
NcSchema.index({ projectId: 1, priority: 1 });

module.exports = mongoose.model("NonConformity", NcSchema);
