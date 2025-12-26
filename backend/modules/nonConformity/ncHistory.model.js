// modules/nonConformity/ncHistory.model.js
const mongoose = require("mongoose");

const NcHistorySchema = new mongoose.Schema(
  {
    ncId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NonConformity",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["CREATED", "ASSIGNED", "STATUS_CHANGED", "VALIDATED"],
      required: true,
    },

    fromStatus: String,
    toStatus: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comment: String,
  },
  { timestamps: true }
);

NcHistorySchema.index({ ncId: 1, createdAt: 1 });

module.exports = mongoose.model("NcHistory", NcHistorySchema);
