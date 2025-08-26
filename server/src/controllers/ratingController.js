const ratingService = require("../services/ratingService");
const {
  success,
  error,
  notFound,
  unauthorized,
} = require("../utils/responses");

class RatingController {
  // Create or update rating for a video
  async createOrUpdateRating(req, res) {
    try {
      const { id: videoId } = req.params;
      const { rating, comment } = req.body;

      const result = await ratingService.createOrUpdateRating(
        videoId,
        req.user.id,
        req.user.email,
        rating,
        comment
      );

      success(res, { rating: result }, "Rating saved successfully", 201);
    } catch (err) {
      console.error("Create/update rating error:", err);
      error(res, "Failed to save rating");
    }
  }

  // Get ratings for a video
  async getRatingsByVideoId(req, res) {
    try {
      const { id: videoId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await ratingService.getRatingsByVideoId(
        videoId,
        parseInt(page),
        parseInt(limit)
      );

      success(res, result, "Ratings retrieved successfully");
    } catch (err) {
      console.error("Get ratings error:", err);
      error(res, "Failed to retrieve ratings");
    }
  }

  // Get rating statistics for a video
  async getRatingStats(req, res) {
    try {
      const { id: videoId } = req.params;

      const stats = await ratingService.getRatingStats(videoId);

      success(res, stats, "Rating statistics retrieved successfully");
    } catch (err) {
      console.error("Get rating stats error:", err);
      error(res, "Failed to retrieve rating statistics");
    }
  }

  // Get user's rating for a video
  async getUserRating(req, res) {
    try {
      const { id: videoId } = req.params;

      const rating = await ratingService.getUserRatingForVideo(
        videoId,
        req.user.id
      );

      if (rating) {
        success(res, { rating }, "User rating retrieved successfully");
      } else {
        success(res, { rating: null }, "No rating found for this user");
      }
    } catch (err) {
      console.error("Get user rating error:", err);
      error(res, "Failed to retrieve user rating");
    }
  }

  // Delete user's rating for a video
  async deleteRating(req, res) {
    try {
      const { id: videoId } = req.params;

      const result = await ratingService.deleteRating(
        videoId,
        req.user.id,
        req.user.role
      );

      success(res, result, "Rating deleted successfully");
    } catch (err) {
      if (err.message === "Rating not found") {
        notFound(res, "Rating");
      } else {
        console.error("Delete rating error:", err);
        error(res, "Failed to delete rating");
      }
    }
  }
}

module.exports = new RatingController();
