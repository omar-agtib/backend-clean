// modules/notifications/notification.controller.js
const asyncHandler = require("express-async-handler");
const service = require("./notification.service");

exports.listMine = asyncHandler(async (req, res) => {
  const unreadOnly = String(req.query.unreadOnly || "false") === "true";
  const list = await service.listMine(req.user.id, { unreadOnly });
  res.json(list);
});

exports.markRead = asyncHandler(async (req, res) => {
  const updated = await service.markRead(req.user.id, req.params.id);
  res.json(updated);
});
