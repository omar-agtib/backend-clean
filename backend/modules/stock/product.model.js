const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    sku: { type: String, unique: true, sparse: true, index: true },
    unit: { type: String }, // pcs, kg, m, etc
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
