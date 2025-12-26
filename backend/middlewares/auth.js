const { verifyToken } = require("../utils/jwt");
const User = require("../modules/auth/user.model");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).lean();
    if (!user || !user.isActive || user.isDeleted) {
      return res.status(401).json({ message: "User inactive" });
    }

    req.user = { id: String(user._id), role: user.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
