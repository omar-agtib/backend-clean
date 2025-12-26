const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

exports.signAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);
