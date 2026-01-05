// modules/dashboard/dashboard.controller.js
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./dashboard.service");

exports.getProjectDashboard = asyncHandler(async (req, res) => {
  const data = await service.getProjectDashboard(req.project._id);
  res.json(data);
});

/**
 * ✅ NEW: global dashboard for current user
 * GET /api/dashboard/overview
 */
exports.getUserOverview = asyncHandler(async (req, res) => {
  const data = await service.getUserOverview(req.user.id);
  res.json(data);
});
