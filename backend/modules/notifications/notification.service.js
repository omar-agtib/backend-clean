// backend/modules/notifications/notification.service.js
const mongoose = require("mongoose");
const Notification = require("./notification.model");
const { getIO } = require("../../ws/io");
const { userRoom } = require("../../ws/rooms");

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

exports.createAndEmit = async ({
  userId,
  projectId,
  type,
  title,
  message,
  data,
}) => {
  if (!userId) throw badRequest("userId is required");
  if (!type) throw badRequest("type is required");
  if (!title) throw badRequest("title is required");

  const doc = await Notification.create({
    userId,
    projectId: projectId || undefined,
    type,
    title,
    message: message || "",
    data: data || undefined,
    isRead: false,
  });

  // ✅ emit to user room
  try {
    const io = getIO();
    io.to(userRoom(String(userId))).emit("notification:new", doc);
  } catch {
    // ignore if WS not ready
  }

  return doc;
};

exports.listMine = async (userId, filters = {}) => {
  if (!userId) throw badRequest("userId is required");

  const q = {
    userId: new mongoose.Types.ObjectId(String(userId)),
  };

  if (filters.projectId) {
    if (!mongoose.isValidObjectId(filters.projectId))
      throw badRequest("Invalid projectId");
    q.projectId = new mongoose.Types.ObjectId(String(filters.projectId));
  }

  if (filters.unreadOnly) q.isRead = false;

  const limit = Math.min(Number(filters.limit || 50), 200);

  return Notification.find(q).sort({ createdAt: -1 }).limit(limit);
};

exports.markRead = async (userId, notificationId) => {
  if (!mongoose.isValidObjectId(notificationId))
    throw badRequest("Invalid notificationId");

  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!updated) {
    const err = new Error("Notification not found");
    err.status = 404;
    throw err;
  }

  return updated;
};

exports.markAllRead = async (userId, projectId) => {
  if (!userId) throw badRequest("userId is required");

  const q = { userId, isRead: false };
  if (projectId) {
    if (!mongoose.isValidObjectId(projectId))
      throw badRequest("Invalid projectId");
    q.projectId = projectId;
  }

  const r = await Notification.updateMany(q, { $set: { isRead: true } });

  return {
    message: "All notifications marked as read",
    modified: r.modifiedCount,
  };
};
