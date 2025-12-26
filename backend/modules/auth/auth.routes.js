// modules/auth/auth.routes.js
const router = require("express").Router();
const ctrl = require("./auth.controller");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 */
router.post("/register", ctrl.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login (sets refresh cookie)
 *     tags: [Auth]
 */
router.post("/login", ctrl.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token (uses refresh cookie)
 *     tags: [Auth]
 */
router.post("/refresh", ctrl.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout (revokes refresh session)
 *     tags: [Auth]
 */
router.post("/logout", ctrl.logout);

module.exports = router;
