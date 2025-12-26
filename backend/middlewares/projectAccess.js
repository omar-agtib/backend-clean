// middlewares/projectAccess.js
const mongoose = require("mongoose");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const projectId =
        req.params?.projectId || req.body?.projectId || req.query?.projectId;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID missing" });
      }

      if (!mongoose.isValidObjectId(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }

      const project = await Project.findOne({
        _id: projectId,
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

      next();
    } catch (err) {
      next(err);
    }
  };
};
