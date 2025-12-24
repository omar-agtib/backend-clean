const router = require("express").Router();
const ctrl = require("./auth.controller");
const auth = require("../../middlewares/auth");

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
 *     summary: Login
 *     tags: [Auth]
 */
router.post("/login", ctrl.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post("/logout", auth, ctrl.logout);

module.exports = router;
