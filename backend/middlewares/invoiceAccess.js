const Project = require("../modules/projects/project.model");
const Invoice = require("../modules/billing/invoice.model");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const invoiceId = req.params.invoiceId || req.body.invoiceId;

      if (!invoiceId) {
        return res.status(400).json({ message: "invoiceId is required" });
      }

      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const project = await Project.findOne({
        _id: invoice.projectId,
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

      // attach
      req.project = project;
      req.projectRole = isOwner ? "OWNER" : member.role;
      req.invoice = invoice;

      next();
    } catch (err) {
      next(err);
    }
  };
};
