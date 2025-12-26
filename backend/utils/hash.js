const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

exports.hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    const err = new Error("Password is required");
    err.status = 400;
    throw err;
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

exports.comparePassword = async (password, hash) => {
  if (!password || typeof password !== "string") return false;
  if (!hash || typeof hash !== "string") return false;
  return bcrypt.compare(password, hash);
};
