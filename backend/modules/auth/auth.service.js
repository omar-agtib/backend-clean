// modules/auth/auth.service.js
const crypto = require("crypto");
const User = require("./user.model");
const Session = require("./session.model");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { signAccessToken } = require("../../utils/jwt");

const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);

function makeRefreshToken() {
  return crypto.randomBytes(48).toString("hex"); // long enough
}

function hashRefresh(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

exports.register = async ({ email, password, name, role }) => {
  const hashed = await hashPassword(password);

  return User.create({
    email,
    password: hashed,
    name,
    role,
  });
};

exports.login = async ({ email, password, ip, userAgent }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken({ id: user._id, role: user.role });

  const refreshToken = makeRefreshToken();
  const refreshTokenHash = hashRefresh(refreshToken);

  const refreshExpiresAt = new Date(
    Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash,
    refreshExpiresAt,
    ip,
    userAgent,
    lastUsedAt: new Date(),
  });

  return {
    accessToken,
    refreshToken, // controller will put it in cookie; JSON only in dev
    sessionId: String(session._id),
    user: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
};

exports.refresh = async ({ refreshToken, ip, userAgent }) => {
  if (!refreshToken) {
    const err = new Error("refreshToken missing");
    err.status = 401;
    throw err;
  }

  const refreshTokenHash = hashRefresh(refreshToken);

  const session = await Session.findOne({
    refreshTokenHash,
    isRevoked: false,
  }).select("+refreshTokenHash");

  if (!session) {
    const err = new Error("Invalid refresh token");
    err.status = 401;
    throw err;
  }

  if (session.refreshExpiresAt <= new Date()) {
    const err = new Error("Refresh token expired");
    err.status = 401;
    throw err;
  }

  const user = await User.findById(session.userId);
  if (!user || !user.isActive || user.isDeleted) {
    const err = new Error("User inactive");
    err.status = 401;
    throw err;
  }

  // ✅ rotate refresh token
  const newRefreshToken = makeRefreshToken();
  session.refreshTokenHash = hashRefresh(newRefreshToken);
  session.lastUsedAt = new Date();
  session.ip = ip;
  session.userAgent = userAgent;
  await session.save();

  const accessToken = signAccessToken({ id: user._id, role: user.role });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

exports.logout = async ({ refreshToken }) => {
  if (!refreshToken) return;

  const refreshTokenHash = hashRefresh(refreshToken);
  await Session.updateOne({ refreshTokenHash }, { isRevoked: true });
};
