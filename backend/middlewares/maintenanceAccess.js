// middlewares/maintenanceAccess.js
const mongoose = require("mongoose");
const Tool = require("../modules/tools/tool.model");
const ToolMaintenance = require("../modules/tools/toolMaintenance.model");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const maintenanceId =
        req.body?.maintenanceId ||
        req.params?.maintenanceId ||
        req.query?.maintenanceId;

      if (!maintenanceId) {
        return res.status(400).json({ message: "maintenanceId is required" });
      }

      if (!mongoose.isValidObjectId(maintenanceId)) {
        return res.status(400).json({ message: "Invalid maintenanceId" });
      }

      const maintenance = await ToolMaintenance.findById(maintenanceId);
      if (!maintenance) {
        return res
          .status(404)
          .json({ message: "Maintenance record not found" });
      }

      const project = await Project.findOne({
        _id: maintenance.projectId,
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

      // Optional: load tool too (nice for controller/service)
      const tool = await Tool.findById(maintenance.toolId);

      req.project = project;
      req.projectRole = isOwner ? "OWNER" : member.role;
      req.maintenance = maintenance;
      req.tool = tool || null;

      next();
    } catch (err) {
      next(err);
    }
  };
};
