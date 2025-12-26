const StockItem = require("../modules/stock/stockItem.model");
const Project = require("../modules/projects/project.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const stockItemId = req.body?.stockItemId || req.params?.stockItemId;

      if (!stockItemId) {
        return res.status(400).json({ message: "stockItemId is required" });
      }

      const item = await StockItem.findById(stockItemId);
      if (!item) {
        return res.status(404).json({ message: "Stock item not found" });
      }

      const project = await Project.findOne({
        _id: item.projectId,
        isDeleted: false,
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

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

      // attach for later use
      req.project = project;
      req.projectRole = isOwner ? "OWNER" : member.role;
      req.stockItem = item;

      next();
    } catch (err) {
      next(err);
    }
  };
};
