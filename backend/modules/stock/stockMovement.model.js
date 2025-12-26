const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StockMovementSchema = new mongoose.Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true, index: true }, // ✅
    stockItemId: {
      type: ObjectId,
      ref: "StockItem",
      required: true,
      index: true,
    },

    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: { type: Number, required: true },
    reason: String,
    userId: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", StockMovementSchema);
