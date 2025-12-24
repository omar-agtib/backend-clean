const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serialNumber: { type: String, unique: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "ASSIGNED", "MAINTENANCE"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tool", ToolSchema);
