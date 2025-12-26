// backend/ws/planEvents.js
const { getIO } = require("./io");
const { projectRoom } = require("./rooms");

/**
 * 🔔 PLAN EVENTS (called from services)
 */

function planCreated(plan) {
  getIO().to(projectRoom(plan.projectId)).emit("plan:created", plan);
}

function planVersionAdded(projectId, planId, version) {
  getIO()
    .to(projectRoom(projectId))
    .emit("plan:versionAdded", { planId, version });
}

// ✅ NEW: version deleted (soft delete)
function planVersionDeleted(projectId, planId, versionId) {
  getIO()
    .to(projectRoom(projectId))
    .emit("plan:versionDeleted", { planId, versionId });
}

// ✅ NEW: version restored
function planVersionRestored(projectId, planId, version) {
  getIO()
    .to(projectRoom(projectId))
    .emit("plan:versionRestored", { planId, version });
}

// ✅ NEW: current version changed (rollback)
function planCurrentVersionSet(projectId, planId, versionId) {
  getIO()
    .to(projectRoom(projectId))
    .emit("plan:currentVersionSet", { planId, versionId });
}

/**
 * 🔔 ANNOTATION EVENTS
 */

function annotationAdded(projectId, annotation) {
  getIO().to(projectRoom(projectId)).emit("annotation:added", annotation);
}

function annotationUpdated(projectId, annotation) {
  getIO().to(projectRoom(projectId)).emit("annotation:updated", annotation);
}

function annotationDeleted(projectId, annotationId) {
  getIO()
    .to(projectRoom(projectId))
    .emit("annotation:deleted", { annotationId });
}

/**
 * 🔌 SOCKET HANDLERS (registered on connection)
 * Optional: later you can add socket.on(...) here
 */
function registerSocketHandlers(io, socket) {
  // optional
}

module.exports = {
  planCreated,
  planVersionAdded,
  planVersionDeleted,
  planVersionRestored,
  planCurrentVersionSet,
  annotationAdded,
  annotationUpdated,
  annotationDeleted,
  registerSocketHandlers,
};
