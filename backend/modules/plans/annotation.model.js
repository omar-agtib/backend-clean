const mongoose = require("mongoose");

const AnnotationSchema = new mongoose.Schema(
  {
    planVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanVersion",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["DRAW", "PIN", "TEXT"],
      required: true,
    },
    geometry: {
      type: Object,
      required: true,
    },
    content: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Offline / sync support
    clientId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Annotation", AnnotationSchema);
