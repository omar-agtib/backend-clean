const express = require("express");

// Loaders
const loadExpress = require("./loaders/express");

const app = express();

// Initialize express (middlewares, routes, swagger)
loadExpress(app);

module.exports = app;
