const mongoose = require("mongoose");

const ProjectMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["PROJECT_MANAGER", "QUALITY", "TEAM_LEADER", "WORKER"],
      required: true,
    },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["PLANNING", "ACTIVE", "COMPLETED", "ARCHIVED"],
      default: "PLANNING",
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [ProjectMemberSchema],

    startDate: Date,
    endDate: Date,

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ "members.userId": 1 });

module.exports = mongoose.model("Project", ProjectSchema);
