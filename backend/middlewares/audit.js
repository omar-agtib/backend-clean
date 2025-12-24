const AuditLog = require("../modules/audit/audit.model");

module.exports = (action) => async (req, res, next) => {
  res.on("finish", async () => {
    if (!req.user) return;

    await AuditLog.create({
      userId: req.user.id,
      action,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
    });
  });

  next();
};
