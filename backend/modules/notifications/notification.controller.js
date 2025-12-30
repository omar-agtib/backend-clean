// backend/modules/notifications/notification.controller.js
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./notification.service");

exports.listMine = asyncHandler(async (req, res) => {
  const { projectId, unreadOnly, limit } = req.query;

  const list = await service.listMine(req.user.id, {
    projectId,
    unreadOnly: unreadOnly === "true",
    limit,
  });

  res.json(list);
});

exports.markRead = asyncHandler(async (req, res) => {
  const updated = await service.markRead(
    req.user.id,
    req.params.notificationId
  );
  res.json(updated);
});

exports.markAllRead = asyncHandler(async (req, res) => {
  const { projectId } = req.body || {};
  const r = await service.markAllRead(req.user.id, projectId);
  res.json(r);
});
