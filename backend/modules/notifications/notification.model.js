// modules/notifications/notification.model.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true, index: true },
    projectId: { type: ObjectId, ref: "Project", index: true },

    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, default: "" },

    data: { type: Object, default: {} },

    readAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
