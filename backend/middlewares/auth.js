const { verifyToken } = require("../utils/jwt");
const Session = require("../modules/auth/session.model");
const User = require("../modules/auth/user.model");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const session = await Session.findOne({
      token,
      isRevoked: false,
    });

    if (!session) {
      return res.status(401).json({ message: "Session invalid" });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive || user.isDeleted) {
      return res.status(401).json({ message: "User inactive" });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
