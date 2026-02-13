// modules/plans/plan.controller.js
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./plan.service");
const { uploadBuffer } = require("../../utils/fileStorage");

exports.create = asyncHandler(async (req, res) => {
  const plan = await service.createPlan(req.body, req.user.id);
  res.status(201).json(plan);
});

exports.listByProject = asyncHandler(async (req, res) => {
  const plans = await service.listByProject(req.params.projectId);
  res.json(plans);
});

exports.listVersions = asyncHandler(async (req, res) => {
  const versions = await service.listVersions(req.params.planId);
  res.json(versions);
});

exports.uploadVersion = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    const err = new Error(
      'No file uploaded. Use form-data key "file" (type File).',
    );
    err.status = 400;
    throw err;
  }

  const uploaded = await uploadBuffer(req.file.buffer, {
    folder: "plans",
    filename: `plan_${Date.now()}`,
    resourceType: "raw",
  });

  const version = await service.addVersion(
    req.params.planId,
    {
      url: uploaded.url,
      publicId: uploaded.publicId,
      bytes: uploaded.bytes,
      resourceType: uploaded.resourceType,
      originalName: req.file.originalname,
    },
    req.user.id,
  );

  res.status(201).json(version);
});

exports.deleteVersion = asyncHandler(async (req, res) => {
  const result = await service.deleteVersion(req.planVersion, req.user.id);
  res.json(result);
});

exports.restoreVersion = asyncHandler(async (req, res) => {
  const version = await service.restoreVersion(req.planVersion, req.user.id);
  res.json(version);
});

exports.setCurrentVersion = asyncHandler(async (req, res) => {
  const result = await service.setCurrentVersion(req.planVersion, req.user.id);
  res.json(result);
});

exports.signedUrl = asyncHandler(async (req, res) => {
  let expiresInSec = Number(req.query.expiresInSec || 3600);

  if (Number.isNaN(expiresInSec) || expiresInSec <= 0) {
    const err = new Error("expiresInSec must be a positive number");
    err.status = 400;
    throw err;
  }

  expiresInSec = Math.min(expiresInSec, 24 * 3600);

  // 🔍 DEBUG: Log version data
  console.log("🔍 Version data:", JSON.stringify(req.planVersion, null, 2));

  const result = await service.getVersionSignedUrl(
    req.planVersion,
    expiresInSec,
  );

  // 🔍 DEBUG: Log generated URL
  console.log("🔍 Generated URL:", result.url);

  res.json(result);
});

exports.getOne = asyncHandler(async (req, res) => {
  res.json(req.plan); // planAccess middleware already loaded it
});
