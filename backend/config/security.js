// backend/config/security.js
const IS_PROD = process.env.NODE_ENV === "production";

module.exports = {
  cors: {
    // In production you should set this to your frontend domain(s)
    origin: IS_PROD
      ? (process.env.CORS_ORIGIN || "").split(",").filter(Boolean)
      : "*",
    credentials: true,
  },

  helmet: {
    // Swagger + socket.io + some frontends may need relaxed CSP during dev
    contentSecurityPolicy: IS_PROD ? undefined : false,
  },

  // Rate limiting defaults (you already have config/rateLimit.js)
};
