// utils/fileStorage.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadBuffer(
  buffer,
  { folder, filename, resourceType = "auto" },
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: resourceType,
        // Currently uploads as public (type: "upload" is default)
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          bytes: result.bytes,
        });
      },
    );
    stream.end(buffer);
  });
}

async function deleteByPublicId(publicId, resourceType = "raw") {
  if (!publicId) return { result: "skipped" };
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

/**
 * ✅ FIXED: Generate signed URL for PUBLIC files
 */
function getSignedUrl(
  publicId,
  { resourceType = "raw", expiresInSec = 3600 } = {},
) {
  if (!publicId) return null;

  const expiresAt =
    Math.floor(Date.now() / 1000) + Number(expiresInSec || 3600);

  // ✅ Use type: "upload" to match how files were uploaded
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: "upload", // ✅ Changed from "authenticated" to "upload"
    sign_url: true,
    expires_at: expiresAt,
    secure: true,
  });
}

module.exports = {
  uploadBuffer,
  deleteByPublicId,
  getSignedUrl,
};
