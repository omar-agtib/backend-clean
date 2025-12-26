// middlewares/milestoneAccess.js
const mongoose = require("mongoose");
const Project = require("../modules/projects/project.model");
const Milestone = require("../modules/progress/milestone.model");

module.exports = (allowedRoles = [], options = {}) => {
  const { includeDeleted = false } = options;

  return async (req, res, next) => {
    try {
      const milestoneId = req.params.milestoneId || req.body.milestoneId;

      if (!milestoneId) {
        return res.status(400).json({ message: "milestoneId is required" });
      }

      if (!mongoose.isValidObjectId(milestoneId)) {
        return res.status(400).json({ message: "Invalid milestoneId" });
      }

      const query = { _id: milestoneId };
      if (!includeDeleted) query.isDeleted = false;

      const milestone = await Milestone.findOne(query);
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }

      const project = await Project.findOne({
        _id: milestone.projectId,
        isDeleted: false,
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const reqUserId = String(req.user?.id);
      const isOwner = String(project.owner) === reqUserId;

      const member = project.members.find(
        (m) => String(m.userId) === reqUserId
      );

      if (!isOwner && !member) {
        return res.status(403).json({ message: "Not a project member" });
      }

      if (
        allowedRoles.length &&
        !isOwner &&
        !allowedRoles.includes(member?.role)
      ) {
        return res.status(403).json({ message: "Insufficient project role" });
      }

      req.project = project;
      req.projectRole = isOwner ? "OWNER" : member.role;
      req.milestone = milestone;

      next();
    } catch (err) {
      next(err);
    }
  };
};
