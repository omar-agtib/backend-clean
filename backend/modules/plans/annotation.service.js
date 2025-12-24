const Annotation = require("./annotation.model");
const planEvents = require("../../ws/planEvents"); // WS events for plans

/**
 * Create a new annotation
 * @param {Object} data - annotation data
 * @param {string} userId - creator ID
 */
exports.createAnnotation = async (data, userId) => {
  // Prevent duplicates from offline sync (clientId ensures idempotency)
  if (data.clientId) {
    const existing = await Annotation.findOne({ clientId: data.clientId });
    if (existing) return existing;
  }

  const annotation = await Annotation.create({
    ...data,
    createdBy: userId,
  });

  // Emit WebSocket event to all users in the project room
  planEvents.annotationAdded(annotation.projectId, annotation);

  return annotation;
};

/**
 * Get all annotations for a plan version
 * @param {string} planVersionId
 */
exports.getAnnotations = async (planVersionId) => {
  return Annotation.find({ planVersionId }).sort({ createdAt: 1 });
};

/**
 * Delete an annotation (optional)
 * @param {string} annotationId
 */
exports.deleteAnnotation = async (annotationId) => {
  const annotation = await Annotation.findByIdAndDelete(annotationId);
  if (!annotation) throw new Error("Annotation not found");

  planEvents.annotationDeleted(annotation.projectId, annotationId);
  return annotation;
};

/**
 * Update an annotation (optional)
 * @param {string} annotationId
 * @param {Object} data
 */
exports.updateAnnotation = async (annotationId, data) => {
  const annotation = await Annotation.findByIdAndUpdate(annotationId, data, {
    new: true,
  });
  if (!annotation) throw new Error("Annotation not found");

  planEvents.annotationUpdated(annotation.projectId, annotation);
  return annotation;
};
