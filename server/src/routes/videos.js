const express = require("express");
const multer = require("multer");
const router = express.Router();
const videoController = require("../controllers/videoController");
const commentController = require("../controllers/commentController");
const ratingController = require("../controllers/ratingController");
const { authenticateToken } = require("../middlewares/auth");
const { requireCreator } = require("../middlewares/rbac");
const { validate, schemas } = require("../middlewares/validation");
const {
  handleUploadError,
  validateVideoFile,
} = require("../middlewares/upload");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow video files only
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         blobUrl:
 *           type: string
 *         fileName:
 *           type: string
 *         fileSize:
 *           type: integer
 *         duration:
 *           type: integer
 *         isPublic:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 */

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Upload a new video with file
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - video
 *             properties:
 *               title:
 *                 type: string
 *                 description: Video title
 *               description:
 *                 type: string
 *                 description: Video description
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to upload (max 100MB)
 *               isPublic:
 *                 type: boolean
 *                 description: Whether the video is public
 *                 default: true
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     video:
 *                       $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 */
router.post(
  "/",
  authenticateToken,
  requireCreator,
  upload.single("video"),
  handleUploadError,
  validateVideoFile,
  validate(schemas.uploadVideo),
  videoController.uploadVideo
);

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get videos with filtering and pagination
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: creatorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 */
router.get("/", videoController.getVideos);

/**
 * @swagger
 * /videos/generate-upload-url:
 *   post:
 *     summary: Generate a pre-signed URL for direct video upload to Azure Blob Storage
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - contentType
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Name of the video file
 *               contentType:
 *                 type: string
 *                 description: MIME type of the video file
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadUrl:
 *                       type: string
 *                     blobUrl:
 *                       type: string
 *                     fileName:
 *                       type: string
 */
router.post(
  "/generate-upload-url",
  authenticateToken,
  requireCreator,
  validate(schemas.generateUploadUrl),
  videoController.generateUploadUrl
);

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video retrieved successfully
 *       404:
 *         description: Video not found
 */
router.get("/:id", videoController.getVideoById);

/**
 * @swagger
 * /videos/{id}/stream:
 *   get:
 *     summary: Stream video content
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Range
 *         schema:
 *           type: string
 *         description: Range header for video streaming
 *     responses:
 *       200:
 *         description: Video stream
 *         content:
 *           video/*:
 *             schema:
 *               type: string
 *               format: binary
 *       206:
 *         description: Partial content for range requests
 *       404:
 *         description: Video not found
 */
router.get("/:id/stream", videoController.streamVideo);

/**
 * @swagger
 * /videos/{id}:
 *   put:
 *     summary: Update video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       404:
 *         description: Video not found
 */
router.put(
  "/:id",
  authenticateToken,
  validate(schemas.updateVideo),
  videoController.updateVideo
);

/**
 * @swagger
 * /videos/{id}:
 *   delete:
 *     summary: Delete video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 */
router.delete("/:id", authenticateToken, videoController.deleteVideo);

// Comment routes
/**
 * @swagger
 * /videos/{id}/comments:
 *   post:
 *     summary: Create a comment for a video
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post(
  "/:id/comments",
  authenticateToken,
  validate(schemas.createComment),
  commentController.createComment
);

/**
 * @swagger
 * /videos/{id}/comments:
 *   get:
 *     summary: Get comments for a video
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get("/:id/comments", commentController.getCommentsByVideoId);

// Rating routes
/**
 * @swagger
 * /videos/{id}/ratings:
 *   post:
 *     summary: Create or update a rating for a video
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating saved successfully
 */
router.post(
  "/:id/ratings",
  authenticateToken,
  validate(schemas.createRating),
  ratingController.createOrUpdateRating
);

/**
 * @swagger
 * /videos/{id}/ratings:
 *   get:
 *     summary: Get ratings for a video
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 */
router.get("/:id/ratings", ratingController.getRatingsByVideoId);

/**
 * @swagger
 * /videos/{id}/ratings/stats:
 *   get:
 *     summary: Get rating statistics for a video
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating statistics retrieved successfully
 */
router.get("/:id/ratings/stats", ratingController.getRatingStats);

module.exports = router;
