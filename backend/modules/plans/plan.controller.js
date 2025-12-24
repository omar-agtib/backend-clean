const asyncHandler = require("../../utils/asyncHandler");
const service = require("./plan.service");

exports.create = asyncHandler(async (req, res) => {
  const plan = await service.createPlan(req.body, req.user.id);
  res.status(201).json(plan);
});

exports.addVersion = asyncHandler(async (req, res) => {
  const version = await service.addVersion(
    req.params.planId,
    req.body.filePath,
    req.user.id
  );
  res.status(201).json(version);
});
