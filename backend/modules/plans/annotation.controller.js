const asyncHandler = require("../../utils/asyncHandler");
const service = require("./annotation.service");

exports.create = asyncHandler(async (req, res) => {
  const annotation = await service.createAnnotation(req.body, req.user.id);
  res.status(201).json(annotation);
});

exports.list = asyncHandler(async (req, res) => {
  const list = await service.getAnnotations(req.params.planVersionId);
  res.json(list);
});
