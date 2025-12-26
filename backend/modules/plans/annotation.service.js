const Annotation = require("./annotation.model");
const PlanVersion = require("./planVersion.model");
const Plan = require("./plan.model");
const planEvents = require("../../ws/planEvents"); // WS events for plans

/**
 * Create a new annotation
 * @param {Object} data - annotation data
 * @param {string} userId - creator ID
 */
exports.createAnnotation = async (data, userId) => {
  // ✅ Basic validation (return clean 400 errors)
  if (!data.planVersionId) {
    const err = new Error("planVersionId is required");
    err.status = 400;
    throw err;
  }

  if (!data.type) {
    const err = new Error("type is required");
    err.status = 400;
    throw err;
  }

  if (!["DRAW", "PIN", "TEXT"].includes(data.type)) {
    const err = new Error("type must be one of: DRAW, PIN, TEXT");
    err.status = 400;
    throw err;
  }

  if (!data.geometry) {
    const err = new Error("geometry is required");
    err.status = 400;
    throw err;
  }

  // ✅ Idempotency for offline sync
  if (data.clientId) {
    const existing = await Annotation.findOne({ clientId: data.clientId });
    if (existing) return existing;
  }

  // 1) Get plan version
  const planVersion = await PlanVersion.findById(data.planVersionId);
  if (!planVersion) {
    const err = new Error("PlanVersion not found");
    err.status = 404;
    throw err;
  }

  // 2) Get plan to retrieve projectId
  const plan = await Plan.findById(planVersion.planId);
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  // 3) Create annotation with projectId
  const annotation = await Annotation.create({
    ...data,
    projectId: plan.projectId,
    createdBy: userId,
  });

  // 4) Emit WS event to project room
  planEvents.annotationAdded(plan.projectId, annotation);

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
