// modules/nonConformity/nc.controller.js
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./nc.service");

exports.create = asyncHandler(async (req, res) => {
  const nc = await service.create(req.body, req.user.id);
  res.status(201).json(nc);
});

exports.assign = asyncHandler(async (req, res) => {
  const updated = await service.assign(
    req.nc,
    req.body.assignedTo,
    req.user.id
  );
  res.json(updated);
});

exports.changeStatus = asyncHandler(async (req, res) => {
  const updated = await service.changeStatus(
    req.nc,
    req.body.status,
    req.user.id,
    req.body.comment
  );
  res.json(updated);
});

exports.list = asyncHandler(async (req, res) => {
  const list = await service.listByProject(req.params.projectId);
  res.json(list);
});

exports.history = asyncHandler(async (req, res) => {
  const list = await service.getHistory(req.params.ncId);
  res.json(list);
});
