// backend/modules/stock/product.controller.js
const asyncHandler = require("express-async-handler");
const Product = require("./product.model");

exports.create = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

exports.list = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ name: 1 });
  res.json(products);
});
