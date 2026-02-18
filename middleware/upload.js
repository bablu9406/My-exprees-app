const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";

    if (file.mimetype.startsWith("video")) {
      resourceType = "video";
    }

    return {
      folder: "posts",
      resource_type: resourceType,
      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "mp4",
        "mov",
        "avi",
        "webm"
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
