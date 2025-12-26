// modules/billing/billing.service.js
const mongoose = require("mongoose");
const Invoice = require("./invoice.model");
const Counter = require("./counter.model");

// 🔔 Notifications
const notifyService = require("../notifications/notification.service");
const Project = require("../projects/project.model");

function asObjectId(id, name = "id") {
  if (!id) {
    const err = new Error(`${name} is required`);
    err.status = 400;
    throw err;
  }
  if (typeof id === "string") {
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error(`Invalid ${name}`);
      err.status = 400;
      throw err;
    }
    return new mongoose.Types.ObjectId(id);
  }
  return id;
}

async function nextInvoiceNumber() {
  const doc = await Counter.findOneAndUpdate(
    { key: "invoice" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const num = String(doc.seq).padStart(6, "0");
  return `INV-${num}`;
}

async function notifyProjectMembers(projectId, actorUserId, payloadBuilder) {
  const project = await Project.findById(projectId);
  if (!project) return;

  const userIds = new Set([
    String(project.owner),
    ...project.members.map((m) => String(m.userId)),
  ]);

  // optional: exclude actor
  if (actorUserId) userIds.delete(String(actorUserId));

  await Promise.all(
    [...userIds].map((uid) => notifyService.createAndEmit(payloadBuilder(uid)))
  );
}

async function createInvoice(projectId, amount, userId) {
  const pid = asObjectId(projectId, "projectId");

  const a = Number(amount);
  if (Number.isNaN(a) || a <= 0) {
    const err = new Error("amount must be a number > 0");
    err.status = 400;
    throw err;
  }

  const number = await nextInvoiceNumber();

  return Invoice.create({
    projectId: pid,
    amount: a,
    number,
    issuedAt: new Date(),
    status: "SENT",
    createdBy: userId || null,
  });
}

async function markPaid(invoiceId, userId) {
  const iid = asObjectId(invoiceId, "invoiceId");

  const invoice = await Invoice.findById(iid);
  if (!invoice) {
    const err = new Error("Invoice not found");
    err.status = 404;
    throw err;
  }

  if (invoice.status === "PAID") {
    const err = new Error("Invoice already paid");
    err.status = 400;
    throw err;
  }

  if (invoice.status === "CANCELLED") {
    const err = new Error("Cannot pay a cancelled invoice");
    err.status = 400;
    throw err;
  }

  invoice.status = "PAID";
  invoice.paidAt = new Date();
  invoice.paidBy = userId || null;
  await invoice.save();

  // 🔔 Notify project members
  await notifyProjectMembers(invoice.projectId, userId, (uid) => ({
    userId: uid,
    projectId: invoice.projectId,
    type: "INVOICE_PAID",
    title: "Invoice paid",
    message: `Invoice ${invoice.number} has been marked as PAID.`,
    data: {
      invoiceId: invoice._id,
      number: invoice.number,
      amount: invoice.amount,
      status: invoice.status,
    },
  }));

  return invoice;
}

async function cancelInvoice(invoiceId, userId) {
  const iid = asObjectId(invoiceId, "invoiceId");

  const invoice = await Invoice.findById(iid);
  if (!invoice) {
    const err = new Error("Invoice not found");
    err.status = 404;
    throw err;
  }

  if (invoice.status === "PAID") {
    const err = new Error("Cannot cancel a paid invoice");
    err.status = 400;
    throw err;
  }

  if (invoice.status === "CANCELLED") return invoice; // idempotent

  invoice.status = "CANCELLED";
  invoice.cancelledAt = new Date();
  invoice.cancelledBy = userId || null;
  await invoice.save();

  // 🔔 Notify project members
  await notifyProjectMembers(invoice.projectId, userId, (uid) => ({
    userId: uid,
    projectId: invoice.projectId,
    type: "INVOICE_CANCELLED",
    title: "Invoice cancelled",
    message: `Invoice ${invoice.number} has been cancelled.`,
    data: {
      invoiceId: invoice._id,
      number: invoice.number,
      amount: invoice.amount,
      status: invoice.status,
    },
  }));

  return invoice;
}

async function listByProject(projectId) {
  const pid = asObjectId(projectId, "projectId");
  return Invoice.find({ projectId: pid }).sort({ createdAt: -1 });
}

async function getById(invoiceId) {
  const iid = asObjectId(invoiceId, "invoiceId");

  const invoice = await Invoice.findById(iid).populate("projectId");
  if (!invoice) {
    const err = new Error("Invoice not found");
    err.status = 404;
    throw err;
  }
  return invoice;
}

async function summaryByProject(projectId) {
  const pid = asObjectId(projectId, "projectId");

  const rows = await Invoice.aggregate([
    { $match: { projectId: pid } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const byStatus = rows.reduce((acc, r) => {
    acc[r._id] = { count: r.count, totalAmount: r.totalAmount };
    return acc;
  }, {});

  const totals = {
    count:
      (byStatus.DRAFT?.count || 0) +
      (byStatus.SENT?.count || 0) +
      (byStatus.PAID?.count || 0) +
      (byStatus.CANCELLED?.count || 0),
    totalAmount:
      (byStatus.DRAFT?.totalAmount || 0) +
      (byStatus.SENT?.totalAmount || 0) +
      (byStatus.PAID?.totalAmount || 0) +
      (byStatus.CANCELLED?.totalAmount || 0),
  };

  return {
    projectId: String(pid),
    totals,
    byStatus: {
      DRAFT: byStatus.DRAFT || { count: 0, totalAmount: 0 },
      SENT: byStatus.SENT || { count: 0, totalAmount: 0 },
      PAID: byStatus.PAID || { count: 0, totalAmount: 0 },
      CANCELLED: byStatus.CANCELLED || { count: 0, totalAmount: 0 },
    },
  };
}

module.exports = {
  createInvoice,
  markPaid,
  cancelInvoice,
  listByProject,
  getById,
  summaryByProject,
};
