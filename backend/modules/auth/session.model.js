// modules/auth/session.model.js
const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ✅ Refresh token (hashed)
    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
      index: true,
    },

    refreshExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    ip: String,
    userAgent: String,

    lastUsedAt: Date,

    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1, isRevoked: 1 });

module.exports = mongoose.model("Session", SessionSchema);
