const Invoice = require("./invoice.model");

async function createInvoice(projectId, amount) {
  const count = await Invoice.countDocuments();
  return Invoice.create({
    projectId,
    amount,
    number: `INV-${count + 1}`,
    issuedAt: new Date(),
  });
}

async function markPaid(invoiceId) {
  return Invoice.findByIdAndUpdate(
    invoiceId,
    { status: "PAID", paidAt: new Date() },
    { new: true }
  );
}

module.exports = {
  createInvoice,
  markPaid,
};
