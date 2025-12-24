const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StockItemSchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 0 },
  location: String,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StockItem", StockItemSchema);
