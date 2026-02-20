const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AnnotationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

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

    // ✅ NEW: Priority field
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    // ✅ NEW: Comments array
    comments: [CommentSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Annotation", AnnotationSchema);
