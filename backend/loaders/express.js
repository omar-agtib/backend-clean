// backend/loaders/express.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const rateLimit = require("../config/rateLimit");
const security = require("../config/security");
const errorHandler = require("../middlewares/errorHandler");
const audit = require("../middlewares/audit");
const logger = require("../config/logger");

module.exports = (app) => {
  require("./swagger")(app);

  app.use(helmet(security.helmet));

  const corsMiddleware = cors(security.cors);
  app.use(corsMiddleware);

  // Handle preflight without wildcard routes
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return corsMiddleware(req, res, () => res.sendStatus(204));
    }
    return next();
  });

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  // Only apply rate limiting in production
  if (process.env.NODE_ENV === "production") {
    app.use(rateLimit);
  }

  app.use("/api/health", require("../modules/health/health.routes"));

  app.use((req, res, next) => {
    try {
      return audit("GLOBAL_REQUEST")(req, res, next);
    } catch (e) {
      logger.warn("Audit middleware failed (ignored)", { message: e.message });
      return next();
    }
  });

  app.use("/api/auth", require("../modules/auth/auth.routes"));
  app.use("/api/projects", require("../modules/projects/project.routes"));
  app.use("/api/plans", require("../modules/plans/plan.routes"));
  app.use("/api/annotations", require("../modules/plans/annotation.routes"));
  app.use("/api/nc", require("../modules/nonConformity/nc.routes"));
  app.use("/api/products", require("../modules/stock/product.routes"));
  app.use("/api/stock", require("../modules/stock/stock.routes"));
  app.use("/api/tools", require("../modules/tools/tool.routes"));
  app.use("/api/progress", require("../modules/progress/progress.routes"));
  app.use("/api/billing", require("../modules/billing/billing.routes"));
  app.use("/api/dashboard", require("../modules/dashboard/dashboard.routes"));
  app.use("/api/files", require("../modules/files/files.routes"));
  app.use("/api/search", require("../modules/search/search.routes"));
  app.use(
    "/api/notifications",
    require("../modules/notifications/notification.routes")
  );

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(errorHandler);
};
