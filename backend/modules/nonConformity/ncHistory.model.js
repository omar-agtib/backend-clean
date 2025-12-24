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
      enum: [
        "CREATED",
        "ASSIGNED",
        "STATUS_CHANGED",
        "RESOLVED",
        "VALIDATED",
        "REJECTED",
      ],
    },

    fromStatus: String,
    toStatus: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("NcHistory", NcHistorySchema);
