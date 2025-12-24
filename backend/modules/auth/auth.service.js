const User = require("./user.model");
const Session = require("./session.model");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { signToken } = require("../../utils/jwt");

exports.register = async ({ email, password, name, role }) => {
  const hashed = await hashPassword(password);

  return User.create({
    email,
    password: hashed,
    name,
    role,
  });
};

exports.login = async ({ email, password, ip, userAgent }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = signToken({ id: user._id, role: user.role });

  await Session.create({
    userId: user._id,
    token,
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + 3600 * 1000),
  });

  return { token };
};

exports.logout = async (token) => {
  await Session.updateOne({ token }, { isRevoked: true });
};
