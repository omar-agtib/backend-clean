const logger = require("../config/logger");

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.status || 500;

  // Mongo duplicate key
  if (err && err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return res.status(409).json({
      message: `Duplicate value for: ${fields.join(", ")}`,
    });
  }

  // Mongoose validation
  if (err && err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  logger.error("Request error", {
    status,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(status).json({
    message: err.message || "Internal Server Error",
  });
};
