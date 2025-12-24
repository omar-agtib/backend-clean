const asyncHandler = require("../../utils/asyncHandler");
const service = require("./project.service");

exports.create = asyncHandler(async (req, res) => {
  const project = await service.createProject(req.body, req.user.id);
  res.status(201).json(project);
});

exports.listMine = asyncHandler(async (req, res) => {
  const projects = await service.listProjectsForUser(req.user.id);
  res.json(projects);
});

exports.addMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const project = await service.addMember(req.project, userId, role);
  res.json(project);
});

exports.removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await service.removeMember(req.project, userId);
  res.json(project);
});
