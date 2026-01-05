// backend/modules/progress/progress.service.js
const mongoose = require("mongoose");
const Milestone = require("./milestone.model");
const progressEvents = require("../../ws/progressEvents");

function ensureObjectId(id, fieldName = "id") {
  if (!id) {
    const err = new Error(`${fieldName} is required`);
    err.status = 400;
    throw err;
  }
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error(`Invalid ${fieldName}`);
    err.status = 400;
    throw err;
  }
  return new mongoose.Types.ObjectId(id);
}

async function createMilestone(projectId, name, userId) {
  const pid = ensureObjectId(projectId, "projectId");

  if (!name || !String(name).trim()) {
    const err = new Error("name is required");
    err.status = 400;
    throw err;
  }

  const milestone = await Milestone.create({
    projectId: pid,
    name: String(name).trim(),
    progress: 0,
    completed: false,
    createdBy: userId,
    isDeleted: false,
  });

  progressEvents.milestoneCreated(pid, milestone);
  return milestone;
}

async function listMilestonesByProject(projectId) {
  const pid = ensureObjectId(projectId, "projectId");

  return Milestone.find({ projectId: pid, isDeleted: false }).sort({
    createdAt: 1,
  });
}

async function updateProgress(milestone, progress, userId) {
  if (!milestone) {
    const err = new Error("Milestone not loaded (milestoneAccess missing?)");
    err.status = 500;
    throw err;
  }

  if (milestone.isDeleted) {
    const err = new Error("Milestone not found");
    err.status = 404;
    throw err;
  }

  const p = Number(progress);
  if (Number.isNaN(p)) {
    const err = new Error("progress must be a number");
    err.status = 400;
    throw err;
  }

  const clamped = Math.max(0, Math.min(100, p));

  milestone.progress = clamped;
  milestone.completed = clamped >= 100;
  milestone.updatedBy = userId;

  await milestone.save();

  progressEvents.milestoneUpdated(milestone.projectId, milestone);
  return milestone;
}

async function deleteMilestone(milestone, userId) {
  if (!milestone) {
    const err = new Error("Milestone not loaded (milestoneAccess missing?)");
    err.status = 500;
    throw err;
  }

  if (milestone.isDeleted) return milestone; // idempotent

  milestone.isDeleted = true;
  milestone.deletedAt = new Date();
  milestone.deletedBy = userId;
  milestone.updatedBy = userId;

  await milestone.save();

  progressEvents.milestoneDeleted(milestone.projectId, milestone._id);
  return milestone;
}

async function summaryByProject(projectId) {
  const pid = ensureObjectId(projectId, "projectId");

  const milestones = await Milestone.find({ projectId: pid, isDeleted: false });

  const total = milestones.length;
  const completed = milestones.filter((m) => m.completed === true).length;
  const remaining = total - completed;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const lastUpdatedAt =
    total === 0
      ? null
      : milestones
          .map((m) => m.updatedAt || m.createdAt)
          .sort((a, b) => b.getTime() - a.getTime())[0];

  return {
    projectId: String(pid),
    totals: { total, completed, remaining },
    completionRate,
    lastUpdatedAt,
  };
}

module.exports = {
  createMilestone,
  listMilestonesByProject,
  updateProgress,
  deleteMilestone,
  summaryByProject,
};
