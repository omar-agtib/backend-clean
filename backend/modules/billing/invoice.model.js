// modules/billing/invoice.model.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const InvoiceSchema = new mongoose.Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true, index: true },

    number: { type: String, required: true, unique: true, index: true },

    amount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["DRAFT", "SENT", "PAID", "CANCELLED"],
      default: "DRAFT",
      index: true,
    },

    issuedAt: { type: Date, default: Date.now },
    paidAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },

    // ✅ audit
    createdBy: { type: ObjectId, ref: "User", default: null },
    paidBy: { type: ObjectId, ref: "User", default: null },
    cancelledBy: { type: ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

InvoiceSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model("Invoice", InvoiceSchema);
