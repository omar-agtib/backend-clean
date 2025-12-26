// middlewares/ncAccess.js
const NC = require("../modules/nonConformity/nc.model");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = [], options = {}) => {
  const { includeDeleted = false } = options;

  return async (req, res, next) => {
    try {
      const ncId = req.params.ncId;
      if (!ncId) {
        return res.status(400).json({ message: "ncId missing" });
      }

      const query = { _id: ncId };
      if (!includeDeleted) query.isDeleted = false;

      const nc = await NC.findOne(query);
      if (!nc) {
        return res.status(404).json({ message: "NC not found" });
      }

      const project = await Project.findOne({
        _id: nc.projectId,
        isDeleted: false,
      }).lean();

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const reqUserId = String(req.user?.id);
      const isOwner = String(project.owner) === reqUserId;

      const member = (project.members || []).find(
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

      // attach
      req.nc = nc;
      req.project = project; // lean object (fine for access)
      req.projectRole = isOwner ? "OWNER" : member.role;

      next();
    } catch (err) {
      next(err);
    }
  };
};
