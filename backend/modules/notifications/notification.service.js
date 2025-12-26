// modules/notifications/notification.service.js
const Notification = require("./notification.model");
const { notifyUser } = require("../../ws/notification");

async function createAndEmit({
  userId,
  projectId,
  type,
  title,
  message,
  data,
}) {
  if (!userId) {
    const err = new Error("userId is required");
    err.status = 400;
    throw err;
  }
  if (!type) {
    const err = new Error("type is required");
    err.status = 400;
    throw err;
  }
  if (!title) {
    const err = new Error("title is required");
    err.status = 400;
    throw err;
  }

  const doc = await Notification.create({
    userId,
    projectId: projectId || null,
    type,
    title,
    message: message || "",
    data: data || {},
  });

  // WS emit
  notifyUser(String(userId), {
    _id: doc._id,
    userId: doc.userId,
    projectId: doc.projectId,
    type: doc.type,
    title: doc.title,
    message: doc.message,
    data: doc.data,
    readAt: doc.readAt,
    createdAt: doc.createdAt,
  });

  return doc;
}

async function listMine(userId, { unreadOnly = false } = {}) {
  const q = { userId };
  if (unreadOnly) q.readAt = null;

  return Notification.find(q).sort({ createdAt: -1 }).limit(100);
}

async function markRead(userId, notificationId) {
  const doc = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { readAt: new Date() },
    { new: true }
  );

  if (!doc) {
    const err = new Error("Notification not found");
    err.status = 404;
    throw err;
  }

  return doc;
}

module.exports = {
  createAndEmit,
  listMine,
  markRead,
};
