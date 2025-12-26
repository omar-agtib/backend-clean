const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = async (mongoUri) => {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
  mongoose.connection.on("error", (err) =>
    logger.error("MongoDB connection error", { message: err.message })
  );

  await mongoose.connect(mongoUri);
};
