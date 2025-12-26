// modules/plans/planVersion.model.js
const mongoose = require("mongoose");

const PlanVersionSchema = new mongoose.Schema(
  {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    versionNumber: {
      type: Number,
      required: true,
    },

    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      bytes: Number,
      resourceType: { type: String, default: "raw" },
      originalName: String,
    },

    // 🔍 Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🗑 Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ✅ Indexes (single source of truth → no duplicates)
PlanVersionSchema.index({ planId: 1, versionNumber: -1 }); // list versions quickly
PlanVersionSchema.index({ projectId: 1 }); // fetch by project
PlanVersionSchema.index({ planId: 1, isDeleted: 1 }); // list active versions quickly

module.exports = mongoose.model("PlanVersion", PlanVersionSchema);
