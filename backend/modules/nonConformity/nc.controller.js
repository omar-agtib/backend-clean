const asyncHandler = require("../../utils/asyncHandler");
const NC = require("./nc.model");
const service = require("./nc.service");

exports.create = asyncHandler(async (req, res) => {
  const nc = await service.create(req.body, req.user.id);
  res.status(201).json(nc);
});

exports.assign = asyncHandler(async (req, res) => {
  const nc = await NC.findById(req.params.ncId);
  const updated = await service.assign(nc, req.body.assignedTo, req.user.id);
  res.json(updated);
});

exports.changeStatus = asyncHandler(async (req, res) => {
  const nc = await NC.findById(req.params.ncId);
  const updated = await service.changeStatus(
    nc,
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
