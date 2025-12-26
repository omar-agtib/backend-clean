const router = require("express").Router();
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const { uploadBuffer } = require("../../utils/fileStorage");

router.post("/upload", auth, upload.single("file"), async (req, res, next) => {
  try {
    const result = await uploadBuffer(req.file.buffer, {
      folder: "plans",
      filename: `plan_${Date.now()}`,
      resourceType: "raw", // PDFs etc
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
