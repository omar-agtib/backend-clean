// middlewares/toolAccess.js
const mongoose = require("mongoose");
const Tool = require("../modules/tools/tool.model");
const ToolAssignment = require("../modules/tools/toolAssignment.model");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const toolId =
        req.body?.toolId || req.params?.toolId || req.query?.toolId;

      if (!toolId) {
        return res.status(400).json({ message: "toolId is required" });
      }

      if (!mongoose.isValidObjectId(toolId)) {
        return res.status(400).json({ message: "Invalid toolId" });
      }

      const tool = await Tool.findById(toolId);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }

      // ✅ Must have an active assignment to derive projectId
      const assignment = await ToolAssignment.findOne({
        toolId,
        returnedAt: null,
      });

      if (!assignment) {
        return res
          .status(400)
          .json({ message: "No active assignment for this tool" });
      }

      const project = await Project.findOne({
        _id: assignment.projectId,
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

      // ✅ attach tool + active assignment
      req.tool = tool;
      req.assignment = assignment;

      next();
    } catch (err) {
      next(err);
    }
  };
};
