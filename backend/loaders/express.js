const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("../config/rateLimit");
const errorHandler = require("../middlewares/errorHandler");
const audit = require("../middlewares/audit");

module.exports = (app) => {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(rateLimit); // global rate limiting
  app.use(audit); // audit logger

  // Register all routes
  app.use("/api/auth", require("../modules/auth/auth.routes"));
  app.use("/api/projects", require("../modules/projects/project.routes"));
  app.use("/api/plans", require("../modules/plans/plan.routes"));
  app.use("/api/annotations", require("../modules/plans/annotation.routes"));
  app.use("/api/nc", require("../modules/nonConformity/nc.routes"));
  app.use("/api/stock", require("../modules/stock/stock.routes"));
  app.use("/api/tools", require("../modules/tools/tool.routes"));
  app.use("/api/progress", require("../modules/progress/progress.routes"));
  app.use("/api/billing", require("../modules/billing/billing.routes"));
  app.use("/api/dashboard", require("../modules/dashboard/dashboard.routes"));

  // Swagger
  require("./swagger")(app);

  // Error handler
  app.use(errorHandler);
};
