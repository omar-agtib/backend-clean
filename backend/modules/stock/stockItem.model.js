const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StockItemSchema = new mongoose.Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true, index: true }, // ✅

    productId: { type: ObjectId, ref: "Product", required: true, index: true },

    quantity: { type: Number, default: 0 },
    location: String,
  },
  { timestamps: true }
);

// avoid duplicate same product in same project (recommended)
StockItemSchema.index({ projectId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("StockItem", StockItemSchema);
