const levels = ["error", "warn", "info", "debug"];

function levelAllowed(current, wanted) {
  return levels.indexOf(wanted) <= levels.indexOf(current);
}

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const IS_PROD = process.env.NODE_ENV === "production";

function format(level, message, meta) {
  const base = {
    ts: new Date().toISOString(),
    level,
    message,
  };
  return meta ? { ...base, meta } : base;
}

function print(level, message, meta) {
  const payload = format(level, message, meta);

  // In production, JSON logs are better for log platforms
  if (IS_PROD) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload));
    return;
  }

  // Local dev readable logs
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  // eslint-disable-next-line no-console
  console.log(`[${payload.ts}] ${level.toUpperCase()}: ${message}${metaStr}`);
}

const logger = {
  error: (msg, meta) =>
    levelAllowed(LOG_LEVEL, "error") && print("error", msg, meta),
  warn: (msg, meta) =>
    levelAllowed(LOG_LEVEL, "warn") && print("warn", msg, meta),
  info: (msg, meta) =>
    levelAllowed(LOG_LEVEL, "info") && print("info", msg, meta),
  debug: (msg, meta) =>
    levelAllowed(LOG_LEVEL, "debug") && print("debug", msg, meta),
};

module.exports = logger;
