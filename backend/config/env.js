function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3001),

  // ✅ fail fast if missing
  mongoUri: required("MONGO_URI"),

  // optional
  logLevel: process.env.LOG_LEVEL || "info",
  corsOrigin: process.env.CORS_ORIGIN || "",
};
