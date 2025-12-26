const router = require("express").Router();
const ctrl = require("./product.controller");
const auth = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Products
 */

router.post("/", auth, ctrl.create);
router.get("/", auth, ctrl.list);

module.exports = router;
