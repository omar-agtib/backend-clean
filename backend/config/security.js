// backend/config/security.js
const IS_PROD = process.env.NODE_ENV === "production";

module.exports = {
  cors: {
    origin: IS_PROD
      ? (process.env.CORS_ORIGIN || "").split(",").filter(Boolean)
      : "http://localhost:5173",
    credentials: true,
  },

  helmet: {
    contentSecurityPolicy: IS_PROD ? undefined : false,
  },
};
