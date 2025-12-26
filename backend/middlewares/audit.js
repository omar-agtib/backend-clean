const AuditLog = require("../modules/audit/audit.model");
const logger = require("../config/logger");

module.exports = (action) => (req, res, next) => {
  if (!res || typeof res.on !== "function") return next();

  res.on("finish", () => {
    // fire-and-forget, never block response
    (async () => {
      try {
        if (!req.user) return;

        await AuditLog.create({
          userId: req.user.id,
          action,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        });
      } catch (err) {
        logger.warn("Audit log failed (ignored)", { message: err.message });
      }
    })();
  });

  next();
};
