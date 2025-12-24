const mongoose = require("mongoose");

const AuditSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    method: String,
    path: String,
    statusCode: Number,
    ip: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditSchema);
