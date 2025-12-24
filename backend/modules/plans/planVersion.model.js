const mongoose = require("mongoose");

const PlanVersionSchema = new mongoose.Schema(
  {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

PlanVersionSchema.index({ planId: 1, versionNumber: -1 });

module.exports = mongoose.model("PlanVersion", PlanVersionSchema);
