const videoService = require("../services/videoService");
const { success, error } = require("../utils/responses");

class DashboardController {
  // Get latest uploaded videos
  async getLatestVideos(req, res) {
    try {
      const { limit = 10 } = req.query;

      const videos = await videoService.getLatestVideos(parseInt(limit));

      success(res, { videos }, "Latest videos retrieved successfully");
    } catch (err) {
      console.error("Get latest videos error:", err);
      error(res, "Failed to retrieve latest videos");
    }
  }

  // Get dashboard statistics (for admin/creator)
  async getDashboardStats(req, res) {
    try {
      // This could be expanded to include more detailed stats
      // For now, we'll return basic info
      const stats = {
        message: "Dashboard statistics endpoint",
        userRole: req.user.role,
        userId: req.user.id,
      };

      success(res, stats, "Dashboard statistics retrieved successfully");
    } catch (err) {
      console.error("Get dashboard stats error:", err);
      error(res, "Failed to retrieve dashboard statistics");
    }
  }
}

module.exports = new DashboardController();
