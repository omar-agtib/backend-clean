const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    serialNumber: { type: String, unique: true, sparse: true, index: true },

    status: {
      type: String,
      enum: ["AVAILABLE", "ASSIGNED", "MAINTENANCE"],
      default: "AVAILABLE",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tool", ToolSchema);
