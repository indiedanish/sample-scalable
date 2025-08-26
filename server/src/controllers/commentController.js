const commentService = require("../services/commentService");
const {
  success,
  error,
  notFound,
  unauthorized,
} = require("../utils/responses");

class CommentController {
  // Create comment for a video
  async createComment(req, res) {
    try {
      const { id: videoId } = req.params;
      const { content } = req.body;

      const comment = await commentService.createComment(
        videoId,
        req.user.id,
        req.user.email,
        content
      );

      success(res, { comment }, "Comment created successfully", 201);
    } catch (err) {
      console.error("Create comment error:", err);
      error(res, "Failed to create comment");
    }
  }

  // Get comments for a video
  async getCommentsByVideoId(req, res) {
    try {
      const { id: videoId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await commentService.getCommentsByVideoId(
        videoId,
        parseInt(page),
        parseInt(limit)
      );

      success(res, result, "Comments retrieved successfully");
    } catch (err) {
      console.error("Get comments error:", err);
      error(res, "Failed to retrieve comments");
    }
  }

  // Update comment
  async updateComment(req, res) {
    try {
      const { id: videoId, commentId } = req.params;
      const { content } = req.body;

      const comment = await commentService.updateComment(
        commentId,
        videoId,
        req.user.id,
        content
      );

      success(res, { comment }, "Comment updated successfully");
    } catch (err) {
      if (err.message === "Comment not found") {
        notFound(res, "Comment");
      } else if (err.message.includes("Access denied")) {
        unauthorized(res, err.message);
      } else {
        console.error("Update comment error:", err);
        error(res, "Failed to update comment");
      }
    }
  }

  // Delete comment
  async deleteComment(req, res) {
    try {
      const { id: videoId, commentId } = req.params;

      const result = await commentService.deleteComment(
        commentId,
        videoId,
        req.user.id,
        req.user.role
      );

      success(res, result, "Comment deleted successfully");
    } catch (err) {
      if (err.message === "Comment not found") {
        notFound(res, "Comment");
      } else if (err.message.includes("Access denied")) {
        unauthorized(res, err.message);
      } else {
        console.error("Delete comment error:", err);
        error(res, "Failed to delete comment");
      }
    }
  }

  // Get comment statistics for a video
  async getCommentStats(req, res) {
    try {
      const { id: videoId } = req.params;

      const stats = await commentService.getCommentStats(videoId);

      success(res, stats, "Comment statistics retrieved successfully");
    } catch (err) {
      console.error("Get comment stats error:", err);
      error(res, "Failed to retrieve comment statistics");
    }
  }
}

module.exports = new CommentController();
