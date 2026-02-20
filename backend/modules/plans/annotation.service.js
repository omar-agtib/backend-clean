// backend/modules/plans/annotation.service.js
const mongoose = require("mongoose");
const Annotation = require("./annotation.model");
const PlanVersion = require("./planVersion.model");
const Plan = require("./plan.model");
const planEvents = require("../../ws/planEvents");

/**
 * Create annotation
 */
exports.createAnnotation = async (data, userId) => {
  if (!data?.planVersionId) {
    const err = new Error("planVersionId is required");
    err.status = 400;
    throw err;
  }

  if (!data?.type) {
    const err = new Error("type is required");
    err.status = 400;
    throw err;
  }

  if (!["DRAW", "PIN", "TEXT"].includes(data.type)) {
    const err = new Error("type must be one of: DRAW, PIN, TEXT");
    err.status = 400;
    throw err;
  }

  if (!data?.geometry) {
    const err = new Error("geometry is required");
    err.status = 400;
    throw err;
  }

  // idempotency (optional)
  if (data.clientId) {
    const existing = await Annotation.findOne({ clientId: data.clientId });
    if (existing) return existing;
  }

  const planVersion = await PlanVersion.findById(data.planVersionId);
  if (!planVersion) {
    const err = new Error("PlanVersion not found");
    err.status = 404;
    throw err;
  }

  const plan = await Plan.findById(planVersion.planId);
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  const annotation = await Annotation.create({
    ...data,
    projectId: plan.projectId,
    createdBy: userId,
  });

  planEvents.annotationAdded(plan.projectId, annotation);
  return annotation;
};

/**
 * List by planVersionId
 */
exports.getAnnotations = async (planVersionId) => {
  if (!mongoose.isValidObjectId(planVersionId)) {
    const err = new Error("Invalid planVersionId");
    err.status = 400;
    throw err;
  }

  // mongoose will cast, but explicit is fine too
  return Annotation.find({ planVersionId }).sort({ createdAt: 1 });
};

/**
 * Update annotation (move pin / edit content / change priority)
 */
exports.updateAnnotation = async (annotationId, data) => {
  if (!mongoose.isValidObjectId(annotationId)) {
    const err = new Error("Invalid annotationId");
    err.status = 400;
    throw err;
  }

  const body = data || {};

  // ✅ support both payloads:
  // 1) { geometry: {...}, content: "..." }
  // 2) { x: 1, y: 2, page: 1, content: "..." }  <-- will be converted
  const computedGeometry =
    body.geometry ??
    (body.x !== undefined || body.y !== undefined || body.page !== undefined
      ? { x: body.x, y: body.y, page: body.page }
      : undefined);

  const update = {};

  if (computedGeometry !== undefined) update.geometry = computedGeometry;
  if (body.content !== undefined) update.content = body.content;
  if (body.type !== undefined) update.type = body.type;
  if (body.priority !== undefined) update.priority = body.priority; // ✅ Added priority

  // ✅ allow setting content to empty string
  if (body.content === "") update.content = "";

  if (Object.keys(update).length === 0) {
    const err = new Error("Nothing to update");
    err.status = 400;
    throw err;
  }

  const updated = await Annotation.findByIdAndUpdate(
    annotationId,
    { $set: update },
    { new: true },
  ).populate("comments.userId", "name email"); // ✅ Populate comments

  if (!updated) {
    const err = new Error("Annotation not found");
    err.status = 404;
    throw err;
  }

  planEvents.annotationUpdated(updated.projectId, updated);
  return updated;
};

/**
 * Delete annotation
 */
exports.deleteAnnotation = async (annotationId) => {
  if (!mongoose.isValidObjectId(annotationId)) {
    const err = new Error("Invalid annotationId");
    err.status = 400;
    throw err;
  }

  const annotation = await Annotation.findByIdAndDelete(annotationId);
  if (!annotation) {
    const err = new Error("Annotation not found");
    err.status = 404;
    throw err;
  }

  planEvents.annotationDeleted(annotation.projectId, annotationId);
  return { message: "Annotation deleted", annotationId };
};

exports.addComment = async (annotationId, userId, text) => {
  if (!mongoose.isValidObjectId(annotationId)) {
    const err = new Error("Invalid annotationId");
    err.status = 400;
    throw err;
  }

  if (!text || !String(text).trim()) {
    const err = new Error("Comment text is required");
    err.status = 400;
    throw err;
  }

  const annotation = await Annotation.findById(annotationId);
  if (!annotation) {
    const err = new Error("Annotation not found");
    err.status = 404;
    throw err;
  }

  annotation.comments.push({
    userId,
    text: String(text).trim(),
    createdAt: new Date(),
  });

  await annotation.save();

  // Populate user details in the returned comment
  await annotation.populate("comments.userId", "name email");

  planEvents.annotationUpdated(annotation.projectId, annotation);
  return annotation;
};

/**
 * Delete comment from annotation
 */
exports.deleteComment = async (annotationId, commentId, userId) => {
  if (!mongoose.isValidObjectId(annotationId)) {
    const err = new Error("Invalid annotationId");
    err.status = 400;
    throw err;
  }

  const annotation = await Annotation.findById(annotationId);
  if (!annotation) {
    const err = new Error("Annotation not found");
    err.status = 404;
    throw err;
  }

  const comment = annotation.comments.id(commentId);
  if (!comment) {
    const err = new Error("Comment not found");
    err.status = 404;
    throw err;
  }

  // Only allow deleting own comments
  if (String(comment.userId) !== String(userId)) {
    const err = new Error("You can only delete your own comments");
    err.status = 403;
    throw err;
  }

  comment.deleteOne();
  await annotation.save();

  planEvents.annotationUpdated(annotation.projectId, annotation);
  return annotation;
};
