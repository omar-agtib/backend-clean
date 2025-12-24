const router = require("express").Router();
const ctrl = require("./stock.controller");
const auth = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Stock
 */

/**
 * @swagger
 * /api/stock:
 *   get:
 *     summary: Get all stock items
 *     tags: [Stock]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", auth, ctrl.getStock);

/**
 * @swagger
 * /api/stock/adjust:
 *   post:
 *     summary: Adjust stock quantity (IN / OUT)
 *     tags: [Stock]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockItemId
 *               - type
 *               - quantity
 *             properties:
 *               stockItemId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [IN, OUT]
 *               quantity:
 *                 type: number
 *               reason:
 *                 type: string
 */
router.post("/adjust", auth, ctrl.adjustStock);

module.exports = router;
