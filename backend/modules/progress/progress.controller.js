const asyncHandler = require("express-async-handler");
const service = require("./progress.service");

exports.list = asyncHandler(async (req, res) => {
  const milestones = await service.listMilestonesByProject(
    req.params.projectId
  );
  res.json(milestones);
});

exports.create = asyncHandler(async (req, res) => {
  const milestone = await service.createMilestone(
    req.body.projectId,
    req.body.name,
    req.user.id
  );
  res.status(201).json(milestone);
});

exports.update = asyncHandler(async (req, res) => {
  const updated = await service.updateProgress(
    req.milestone,
    req.body.progress,
    req.user.id
  );
  res.json(updated);
});

exports.remove = asyncHandler(async (req, res) => {
  const removed = await service.deleteMilestone(req.milestone, req.user.id);
  res.json(removed);
});

/**
 * ✅ GET /api/progress/project/:projectId/summary
 */
exports.summary = asyncHandler(async (req, res) => {
  const result = await service.summaryByProject(req.params.projectId);
  res.json(result);
});
