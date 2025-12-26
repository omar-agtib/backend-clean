// modules/plans/plan.service.js
const Plan = require("./plan.model");
const PlanVersion = require("./planVersion.model");
const Annotation = require("./annotation.model");
const NC = require("../nonConformity/nc.model");
const planEvents = require("../../ws/planEvents");
const { getSignedUrl } = require("../../utils/fileStorage");

// tiny helper: do not crash if an event fn is missing
function safeEmit(fn, ...args) {
  try {
    if (typeof fn === "function") fn(...args);
  } catch (e) {
    // never break API because WS failed
    // console.warn("WS emit failed:", e.message);
  }
}

exports.createPlan = async (data, userId) => {
  if (!data?.projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }

  if (!data?.name || !String(data.name).trim()) {
    const err = new Error("Plan name is required");
    err.status = 400;
    throw err;
  }

  const plan = await Plan.create({
    projectId: data.projectId,
    name: String(data.name).trim(),
    createdBy: userId,
  });

  safeEmit(planEvents.planCreated, plan);
  return plan;
};

exports.listByProject = async (projectId) => {
  if (!projectId) {
    const err = new Error("projectId is required");
    err.status = 400;
    throw err;
  }

  return Plan.find({ projectId, isDeleted: false }).sort({ createdAt: -1 });
};

exports.listVersions = async (planId) => {
  if (!planId) {
    const err = new Error("planId is required");
    err.status = 400;
    throw err;
  }

  return PlanVersion.find({ planId, isDeleted: false }).sort({
    versionNumber: 1,
  });
};

exports.addVersion = async (planId, file, userId) => {
  const plan = await Plan.findOne({ _id: planId, isDeleted: false });
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  if (!file?.url || !file?.publicId) {
    const err = new Error("file.url and file.publicId are required");
    err.status = 400;
    throw err;
  }

  const last = await PlanVersion.findOne({ planId, isDeleted: false }).sort({
    versionNumber: -1,
  });

  const versionNumber = last ? last.versionNumber + 1 : 1;

  const version = await PlanVersion.create({
    planId,
    projectId: plan.projectId,
    versionNumber,
    file: {
      url: file.url,
      publicId: file.publicId,
      bytes: file.bytes,
      resourceType: file.resourceType || "raw",
      originalName: file.originalName,
    },
    createdBy: userId,
    isDeleted: false,
  });

  // by default newest becomes current
  plan.currentVersion = version._id;
  plan.updatedBy = userId;
  await plan.save();

  safeEmit(planEvents.planVersionAdded, plan.projectId, planId, version);
  return version;
};

/**
 * ✅ Block deletion if used by NC or Annotations
 */
async function assertVersionNotUsed(versionId) {
  const [ncCount, annCount] = await Promise.all([
    NC.countDocuments({ planVersionId: versionId, isDeleted: false }),
    Annotation.countDocuments({ planVersionId: versionId }),
  ]);

  if (ncCount > 0 || annCount > 0) {
    const err = new Error(
      "Cannot delete: version is referenced by NC or annotations"
    );
    err.status = 409;
    err.details = { ncCount, annCount };
    throw err;
  }
}

/**
 * ✅ Soft delete ONLY (keep cloud file to allow restore)
 */
exports.deleteVersion = async (version, userId) => {
  if (!version) {
    const err = new Error("PlanVersion not found");
    err.status = 404;
    throw err;
  }

  if (version.isDeleted) {
    const err = new Error("PlanVersion already deleted");
    err.status = 409;
    throw err;
  }

  const plan = await Plan.findOne({ _id: version.planId, isDeleted: false });
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  // 🚫 lock if used
  await assertVersionNotUsed(version._id);

  version.isDeleted = true;
  version.deletedAt = new Date();
  version.deletedBy = userId;
  // version.updatedBy = userId; // only if your schema includes updatedBy
  await version.save();

  const isCurrent =
    plan.currentVersion && String(plan.currentVersion) === String(version._id);

  let newCurrent = plan.currentVersion;

  // If currentVersion deleted → move current to latest remaining
  if (isCurrent) {
    const latestRemaining = await PlanVersion.findOne({
      planId: plan._id,
      isDeleted: false,
    }).sort({ versionNumber: -1 });

    newCurrent = latestRemaining ? latestRemaining._id : null;
    plan.currentVersion = newCurrent;
    plan.updatedBy = userId;
    await plan.save();
  }

  // Optional WS event (only if you add it)
  safeEmit(
    planEvents.planVersionDeleted,
    plan.projectId,
    plan._id,
    version._id
  );

  return {
    deletedVersionId: version._id,
    planId: plan._id,
    currentVersion: newCurrent,
  };
};

/**
 * ✅ Restore a deleted version
 */
exports.restoreVersion = async (version, userId) => {
  if (!version) {
    const err = new Error("PlanVersion not found");
    err.status = 404;
    throw err;
  }

  // make sure parent plan exists (and not deleted)
  const plan = await Plan.findOne({ _id: version.planId, isDeleted: false });
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  if (!version.isDeleted) return version;

  version.isDeleted = false;
  version.deletedAt = null;
  version.deletedBy = null;
  // version.updatedBy = userId; // only if schema supports it
  await version.save();

  // Optional behavior: if plan has no current version, set restored as current
  if (!plan.currentVersion) {
    plan.currentVersion = version._id;
    plan.updatedBy = userId;
    await plan.save();
  }

  safeEmit(planEvents.planVersionRestored, plan.projectId, plan._id, version);

  return version;
};

/**
 * ✅ Rollback: set this version as plan.currentVersion
 */
exports.setCurrentVersion = async (version, userId) => {
  if (!version) {
    const err = new Error("PlanVersion not found");
    err.status = 404;
    throw err;
  }

  if (version.isDeleted) {
    const err = new Error("Cannot set current: version is deleted");
    err.status = 409;
    throw err;
  }

  const plan = await Plan.findOne({ _id: version.planId, isDeleted: false });
  if (!plan) {
    const err = new Error("Plan not found");
    err.status = 404;
    throw err;
  }

  plan.currentVersion = version._id;
  plan.updatedBy = userId;
  await plan.save();

  safeEmit(planEvents.planCurrentVersionSet, plan.projectId, plan._id, version);

  return {
    planId: plan._id,
    currentVersion: plan.currentVersion,
  };
};

/**
 * ✅ Signed URL for the file
 */
exports.getVersionSignedUrl = async (version, expiresInSec = 3600) => {
  if (!version) {
    const err = new Error("PlanVersion not found");
    err.status = 404;
    throw err;
  }

  let exp = Number(expiresInSec || 3600);
  if (Number.isNaN(exp) || exp <= 0) {
    const err = new Error("expiresInSec must be a positive number");
    err.status = 400;
    throw err;
  }
  exp = Math.min(exp, 24 * 3600); // cap 24h

  const publicId = version?.file?.publicId;
  const resourceType = version?.file?.resourceType || "raw";

  if (!publicId) {
    const err = new Error("No publicId found for this version file");
    err.status = 400;
    throw err;
  }

  const url = getSignedUrl(publicId, { resourceType, expiresInSec: exp });

  return {
    versionId: version._id,
    expiresInSec: exp,
    url,
  };
};
