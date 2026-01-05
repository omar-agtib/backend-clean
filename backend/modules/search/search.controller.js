const asyncHandler = require("express-async-handler");
const service = require("./search.service");

exports.search = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const limit = req.query.limit || 8;

  const data = await service.searchAll({
    userId: req.user.id,
    q,
    limit,
  });

  res.json(data);
});
