// multerImageUpload.js
import multer from "multer";

// Setup multer storage - files will be stored in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter(req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Please upload an image file."));
    }
    cb(null, true);
  },
});

export default upload;
