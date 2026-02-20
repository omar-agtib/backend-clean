// backend/modules/plans/annotation.controller.js

const asyncHandler = require("../../utils/asyncHandler");
const service = require("./annotation.service");
const mongoose = require("mongoose");

exports.create = asyncHandler(async (req, res) => {
  const annotation = await service.createAnnotation(req.body, req.user.id);
  res.status(201).json(annotation);
});

exports.list = asyncHandler(async (req, res) => {
  const list = await service.getAnnotations(req.params.planVersionId);
  res.json(list);
});

exports.update = asyncHandler(async (req, res) => {
  const updated = await service.updateAnnotation(
    req.params.annotationId,
    req.body || {},
  );
  res.json(updated);
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await service.deleteAnnotation(req.params.annotationId);
  res.json(result);
});

// ✅ FIX: Proper async handler for addComment
exports.addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const annotation = await service.addComment(
    req.params.annotationId,
    req.user.id,
    text,
  );
  res.json(annotation);
});

// ✅ FIX: Proper async handler for deleteComment
exports.deleteComment = asyncHandler(async (req, res) => {
  const annotation = await service.deleteComment(
    req.params.annotationId,
    req.params.commentId,
    req.user.id,
  );
  res.json(annotation);
});
