const asyncHandler = require("../../utils/asyncHandler");
const service = require("./dashboard.service");

exports.getProjectDashboard = asyncHandler(async (req, res) => {
  const data = await service.getProjectDashboard(req.project._id);
  res.json(data);
});
