const Milestone = require("./milestone.model");

async function updateProgress(milestoneId, progress) {
  const completed = progress >= 100;
  return Milestone.findByIdAndUpdate(
    milestoneId,
    { progress, completed },
    { new: true }
  );
}

module.exports = {
  updateProgress,
};
