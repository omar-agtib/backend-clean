// backend/modules/notifications/notification.routes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const ctrl = require("./notification.controller");

/**
 * @swagger
 * tags:
 *   name: Notifications
 */

router.get("/", auth, ctrl.listMine);
router.patch("/:notificationId/read", auth, ctrl.markRead);
router.post("/read-all", auth, ctrl.markAllRead);

module.exports = router;
