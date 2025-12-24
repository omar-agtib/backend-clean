const connectDb = require("../config/db");
const { mongoUri } = require("../config/env");

module.exports = async () => {
  if (!mongoUri) {
    throw new Error("MONGO_URI not defined");
  }
  await connectDb(mongoUri);
};
