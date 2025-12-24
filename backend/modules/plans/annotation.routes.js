const router = require("express").Router();
const auth = require("../../middlewares/auth");
const ctrl = require("./annotation.controller");

/**
 * @swagger
 * tags:
 *   name: Annotations
 */

router.post("/", auth, ctrl.create);

router.get("/:planVersionId", auth, ctrl.list);

module.exports = router;
