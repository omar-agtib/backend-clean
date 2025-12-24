const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const InvoiceSchema = new mongoose.Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true },
    number: { type: String, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "PAID", "CANCELLED"],
      default: "DRAFT",
    },
    issuedAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
