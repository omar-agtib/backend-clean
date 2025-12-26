const Plan = require("../modules/plans/plan.model");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const planId = req.params.planId;
      if (!planId) return res.status(400).json({ message: "Plan ID missing" });

      const plan = await Plan.findById(planId);
      if (!plan) return res.status(404).json({ message: "Plan not found" });

      const project = await Project.findOne({
        _id: plan.projectId,
        isDeleted: false,
      });
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const reqUserId = String(req.user?.id);
      const isOwner = project.owner.toString() === reqUserId;

      const member = project.members.find(
        (m) => m.userId.toString() === reqUserId
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

      req.plan = plan;
      req.project = project;
      req.projectRole = isOwner ? "OWNER" : member.role;

      next();
    } catch (err) {
      next(err);
    }
  };
};
