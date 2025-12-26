// modules/notifications/notification.routes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const ctrl = require("./notification.controller");

/**
 * GET /api/notifications?unreadOnly=true
 */
router.get("/", auth, ctrl.listMine);

/**
 * POST /api/notifications/:id/read
 */
router.post("/:id/read", auth, ctrl.markRead);

module.exports = router;
