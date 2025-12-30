// backend/modules/notifications/notification.model.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },

    type: { type: String, required: true, index: true }, // e.g. NC_ASSIGNED, NC_VALIDATED
    title: { type: String, required: true },
    message: { type: String },

    // optional payload: { ncId, planId, ... }
    data: { type: Object },

    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
