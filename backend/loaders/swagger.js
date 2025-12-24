const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./modules/**/*.routes.js"], // <-- make sure the path is correct
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  const swaggerUi = require("swagger-ui-express");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
