const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const logger = require("../config/logger");

const { port } = require("../config/env");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation for the backend",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // ⚠️ Do NOT force auth globally; set per endpoint in swagger blocks
    // security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "../modules/**/*.routes.js")],
};

const swaggerSpec = swaggerJsdoc(options);

logger.info("📘 Swagger spec generated", {
  paths: Object.keys(swaggerSpec.paths || {}).length,
});

module.exports = (app) => {
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );
};
