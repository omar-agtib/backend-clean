// backend/modules/plans/annotation.routes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const ctrl = require("./annotation.controller");

/**
 * /api/annotations
 */

router.post("/", auth, ctrl.create);

// list annotations by planVersionId
router.get("/:planVersionId", auth, ctrl.list);

// update annotation (drag / edit)
router.patch("/:annotationId", auth, ctrl.update);

// delete annotation (right click delete)
router.delete("/:annotationId", auth, ctrl.remove);

router.post("/:annotationId/comments", auth, ctrl.addComment);
router.delete("/:annotationId/comments/:commentId", auth, ctrl.deleteComment);

module.exports = router;
