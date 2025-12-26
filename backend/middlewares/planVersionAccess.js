// middlewares/planVersionAccess.js
const mongoose = require("mongoose");
const PlanVersion = require("../modules/plans/planVersion.model");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = [], options = {}) => {
  const { includeDeleted = false } = options;

  return async (req, res, next) => {
    try {
      const versionId = req.params.versionId;

      if (!versionId) {
        return res.status(400).json({ message: "versionId missing" });
      }

      // ✅ Prevent CastError crashes
      if (!mongoose.Types.ObjectId.isValid(versionId)) {
        return res.status(400).json({ message: "Invalid versionId" });
      }

      const query = { _id: versionId };
      if (!includeDeleted) query.isDeleted = false;

      const version = await PlanVersion.findOne(query);
      if (!version) {
        return res.status(404).json({ message: "PlanVersion not found" });
      }

      // ✅ Validate projectId just in case (should always exist)
      const projectId = String(version.projectId);
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res
          .status(500)
          .json({ message: "Corrupted projectId on version" });
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
      req.planVersion = version;
      req.projectRole = isOwner ? "OWNER" : member.role;

      next();
    } catch (err) {
      next(err);
    }
  };
};
