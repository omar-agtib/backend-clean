const asyncHandler = require("express-async-handler");
const Milestone = require("./milestone.model");
const service = require("./progress.service");

exports.list = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({
    projectId: req.params.projectId,
  });
  res.json(milestones);
});

exports.update = asyncHandler(async (req, res) => {
  const milestone = await service.updateProgress(
    req.params.milestoneId,
    req.body.progress
  );
  res.json(milestone);
});
