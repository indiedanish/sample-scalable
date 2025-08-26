const multer = require("multer");

// Error handler for multer upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(413).json({
          success: false,
          error: "File Too Large",
          message: "File size exceeds the maximum allowed limit (100MB)",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          error: "Too Many Files",
          message: "Maximum number of files exceeded",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          error: "Unexpected Field",
          message: "Unexpected file field",
        });
      default:
        return res.status(400).json({
          success: false,
          error: "Upload Error",
          message: err.message,
        });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: "Upload Error",
      message: err.message,
    });
  }
  next();
};

// Video file validation
const validateVideoFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "Missing File",
      message: "Video file is required",
    });
  }

  const videoFile = req.file;

  // Check file type
  if (!videoFile.mimetype.startsWith("video/")) {
    return res.status(400).json({
      success: false,
      error: "Invalid File Type",
      message: "Only video files are allowed",
    });
  }

  // Check file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (videoFile.size > maxSize) {
    return res.status(413).json({
      success: false,
      error: "File Too Large",
      message: "Video file must be smaller than 100MB",
    });
  }

  next();
};

module.exports = {
  handleUploadError,
  validateVideoFile,
};
