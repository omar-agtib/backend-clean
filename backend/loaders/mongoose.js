const connectDb = require("../config/db");
const { mongoUri } = require("../config/env");

module.exports = async () => {
  await connectDb(mongoUri);
};
