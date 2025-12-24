const asyncHandler = require("../../utils/asyncHandler");
const service = require("./auth.service");

exports.register = asyncHandler(async (req, res) => {
  const user = await service.register(req.body);
  res.status(201).json(user);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await service.login({
    ...req.body,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  res.json(result);
});

exports.logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  await service.logout(token);
  res.json({ message: "Logged out" });
});
