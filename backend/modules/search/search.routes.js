const router = require("express").Router();
const auth = require("../../middlewares/auth");
const ctrl = require("./search.controller");

/**
 * GET /api/search?q=...
 */
router.get("/", auth, ctrl.search);

module.exports = router;
