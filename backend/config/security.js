// backend/config/security.js
const IS_PROD = process.env.NODE_ENV === "production";

const devOrigin = "http://localhost:5173";

const prodOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

module.exports = {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const allowed = IS_PROD ? prodOrigins : [devOrigin];
      return cb(null, allowed.includes(origin));
    },
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
    maxAge: 86400,
  },

  helmet: {
    contentSecurityPolicy: IS_PROD ? undefined : false,
  },
};
