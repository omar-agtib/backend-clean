const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    const projectId = req.params.projectId || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID missing" });
    }

    const project = await Project.findOne({
      _id: projectId,
      isDeleted: false,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user.id;

    const member = project.members.find(
      (m) => m.userId.toString() === req.user.id
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
  };
};
