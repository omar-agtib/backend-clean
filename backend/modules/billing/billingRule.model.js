const mongoose = require("mongoose");

const BillingRuleSchema = new mongoose.Schema({
  name: String,
  description: String,
  rate: Number,
  unit: String, // hour, item, fixed
});

module.exports = mongoose.model("BillingRule", BillingRuleSchema);
