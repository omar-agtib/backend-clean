const Plan = require("./plan.model");
const PlanVersion = require("./planVersion.model");
const planEvents = require("../../ws/planEvents"); // WebSocket events

/**
 * Create a new plan
 * @param {Object} data
 * @param {string} userId
 */
exports.createPlan = async (data, userId) => {
  if (!data.name) throw new Error("Plan name is required");

  const plan = await Plan.create({
    ...data,
    createdBy: userId,
  });

  // Emit WS event: plan created
  planEvents.planCreated(plan);

  return plan;
};

/**
 * Add a new version to a plan
 * @param {string} planId
 * @param {string} filePath
 * @param {string} userId
 */
exports.addVersion = async (planId, filePath, userId) => {
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error("Plan not found");

  const lastVersion = await PlanVersion.findOne({ planId }).sort({
    versionNumber: -1,
  });
  const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

  const version = await PlanVersion.create({
    planId,
    versionNumber,
    filePath,
    createdBy: userId,
  });

  plan.currentVersion = version._id;
  await plan.save();

  // Emit WS event: new version added
  planEvents.planVersionAdded(planId, version);

  return version;
};

/**
 * Get all plans for a project
 * @param {string} projectId
 */
exports.listByProject = async (projectId) => {
  return Plan.find({ projectId }).sort({ createdAt: -1 });
};

/**
 * Get all versions for a plan
 * @param {string} planId
 */
exports.listVersions = async (planId) => {
  return PlanVersion.find({ planId }).sort({ versionNumber: 1 });
};
