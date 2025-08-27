const videoService = require("../services/videoService");
const blobService = require("../services/blobService");
const {
  success,
  error,
  notFound,
  unauthorized,
} = require("../utils/responses");

class VideoController {
  // Upload video with file
  async uploadVideo(req, res) {
    try {
      const { title, description, isPublic = true } = req.body;
      const videoFile = req.file;

      if (!videoFile) {
        return error(res, "Video file is required", 400);
      }

      // Validate file type
      if (!videoFile.mimetype.startsWith("video/")) {
        return error(
          res,
          "Invalid file type. Only video files are allowed.",
          400
        );
      }

      // Upload video to Azure Blob Storage
      const videoUploadResult = await blobService.uploadFile(
        videoFile.buffer,
        videoFile.originalname,
        videoFile.mimetype
      );

      // Create video record in database
      const videoData = {
        title,
        description,
        fileName: videoFile.originalname,
        fileSize: videoFile.size,
        blobUrl: videoUploadResult.url,
        isPublic: isPublic === "true" || isPublic === true,
        duration: null, // Will be updated later if available
      };

      const video = await videoService.createVideo(videoData, req.user.id);

      success(res, { video }, "Video uploaded successfully", 201);
    } catch (err) {
      console.error("Upload video error:", err);
      error(res, "Failed to upload video");
    }
  }

  // Create video (metadata only - for external uploads)
  async createVideo(req, res) {
    try {
      const video = await videoService.createVideo(req.body, req.user.id);
      success(res, { video }, "Video created successfully", 201);
    } catch (err) {
      console.error("Create video error:", err);
      error(res, "Failed to create video");
    }
  }

  // Get all videos with filtering and pagination
  async getVideos(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        creatorId,
        minDuration,
        maxDuration,
        startDate,
        endDate,
      } = req.query;

      const filters = {
        search,
        creatorId,
        minDuration,
        maxDuration,
        startDate,
        endDate,
      };

      // Remove undefined filters
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined) delete filters[key];
      });

      const includePrivate =
        req.user && ["ADMIN", "CREATOR"].includes(req.user.role);
      const result = await videoService.getVideos(
        filters,
        parseInt(page),
        parseInt(limit),
        req.user?.id,
        includePrivate
      );

      success(res, result, "Videos retrieved successfully");
    } catch (err) {
      console.error("Get videos error:", err);
      error(res, "Failed to retrieve videos");
    }
  }

  // Get video by ID
  async getVideoById(req, res) {
    try {
      const { id } = req.params;
      const includePrivate =
        req.user && ["ADMIN", "CREATOR"].includes(req.user.role);

      const video = await videoService.getVideoById(
        id,
        includePrivate,
        req.user?.id
      );

      success(res, { video }, "Video retrieved successfully");
    } catch (err) {
      if (err.message === "Video not found") {
        notFound(res, "Video");
      } else {
        console.error("Get video error:", err);
        error(res, "Failed to retrieve video");
      }
    }
  }

  // Stream video content
  async streamVideo(req, res) {
    try {
      const { id } = req.params;
      const range = req.headers.range;

      // Get video info
      const video = await videoService.getVideoById(id, false, req.user?.id);

      if (!video.blobUrl) {
        return notFound(res, "Video file");
      }

      // Get blob stream from Azure
      const streamResult = await blobService.getReelStream(
        video.blobUrl,
        range
      );

      if (range) {
        res.status(206);
        res.set({
          "Content-Range": streamResult.contentRange,
          "Accept-Ranges": "bytes",
          "Content-Length": streamResult.contentLength,
          "Content-Type": streamResult.contentType || "video/mp4",
        });
      } else {
        res.set({
          "Content-Length": streamResult.contentLength,
          "Content-Type": streamResult.contentType || "video/mp4",
        });
      }

      streamResult.stream.pipe(res);
    } catch (err) {
      if (err.message === "Video not found") {
        notFound(res, "Video");
      } else {
        console.error("Stream video error:", err);
        error(res, "Failed to stream video");
      }
    }
  }

  // Update video
  async updateVideo(req, res) {
    try {
      const { id } = req.params;
      const video = await videoService.updateVideo(
        id,
        req.body,
        req.user.id,
        req.user.role
      );

      success(res, { video }, "Video updated successfully");
    } catch (err) {
      if (err.message === "Video not found") {
        notFound(res, "Video");
      } else if (err.message.includes("Access denied")) {
        unauthorized(res, err.message);
      } else {
        console.error("Update video error:", err);
        error(res, "Failed to update video");
      }
    }
  }

  // Delete video
  async deleteVideo(req, res) {
    try {
      const { id } = req.params;
      const result = await videoService.deleteVideo(
        id,
        req.user.id,
        req.user.role
      );

      success(res, result, "Video deleted successfully");
    } catch (err) {
      if (err.message === "Video not found") {
        notFound(res, "Video");
      } else if (err.message.includes("Access denied")) {
        unauthorized(res, err.message);
      } else {
        console.error("Delete video error:", err);
        error(res, "Failed to delete video");
      }
    }
  }

  // Generate upload URL for blob storage
  async generateUploadUrl(req, res) {
    try {
      const { fileName, contentType } = req.body;
      const result = await blobService.generateUploadUrl(fileName, contentType);
      success(res, result, "Upload URL generated successfully");
    } catch (err) {
      console.error("Generate upload URL error:", err);
      error(res, "Failed to generate upload URL");
    }
  }
}

module.exports = new VideoController();
