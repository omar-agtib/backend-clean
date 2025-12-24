const mongoose = require("mongoose");

module.exports = async (mongoUri) => {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
