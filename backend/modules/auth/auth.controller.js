// modules/auth/auth.controller.js
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./auth.service");

const COOKIE_NAME = "refreshToken";

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // true in production (https)
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth",
  };
}

exports.register = asyncHandler(async (req, res) => {
  const user = await service.register(req.body);
  res.status(201).json(user);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await service.login({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // ✅ set refresh token in cookie
  res.cookie(COOKIE_NAME, result.refreshToken, cookieOptions());

  // In dev: return refreshToken too (so Postman easy)
  const isProd = process.env.NODE_ENV === "production";

  res.json({
    accessToken: result.accessToken,
    sessionId: result.sessionId,
    user: result.user,
    ...(isProd ? {} : { refreshToken: result.refreshToken }),
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[COOKIE_NAME];

  const result = await service.refresh({
    refreshToken,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // rotate cookie
  res.cookie(COOKIE_NAME, result.refreshToken, cookieOptions());

  const isProd = process.env.NODE_ENV === "production";
  res.json({
    accessToken: result.accessToken,
    ...(isProd ? {} : { refreshToken: result.refreshToken }),
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[COOKIE_NAME];

  await service.logout({ refreshToken });

  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ message: "Logged out" });
});
