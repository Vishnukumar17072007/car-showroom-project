const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
        }
    },
});

// checks if the file exceeds 5mb or not
const limitChecker = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size should not exceed 5MB" });
      }
      return res.status(400).json({ message: err.message });
    }
  
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
  
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};

module.exports = {upload, limitChecker};