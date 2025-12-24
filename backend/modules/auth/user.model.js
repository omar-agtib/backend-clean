const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "PROJECT_MANAGER", "QUALITY", "TEAM_LEADER", "WORKER"],
      default: "WORKER",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, isDeleted: 1 });

module.exports = mongoose.model("User", UserSchema);
