const router = require("express").Router();
const ctrl = require("./billing.controller");
const auth = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Billing
 */

/**
 * @swagger
 * /api/billing:
 *   get:
 *     summary: List invoices
 *     tags: [Billing]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/", auth, ctrl.list);

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Create invoice
 *     tags: [Billing]
 *     security: [{ bearerAuth: [] }]
 */
router.post("/", auth, ctrl.create);

/**
 * @swagger
 * /api/billing/{invoiceId}/pay:
 *   post:
 *     summary: Mark invoice as paid
 *     tags: [Billing]
 *     security: [{ bearerAuth: [] }]
 */
router.post("/:invoiceId/pay", auth, ctrl.markPaid);

module.exports = router;
