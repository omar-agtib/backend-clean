const mongoose = require("mongoose");

const NcSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    description: String,

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "VALIDATED"],
      default: "OPEN",
      index: true,
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

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NcSchema.index({ projectId: 1, status: 1 });

module.exports = mongoose.model("NonConformity", NcSchema);
