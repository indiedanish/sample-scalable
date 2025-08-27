const userService = require("../services/userService");
const { success, error, unauthorized } = require("../utils/responses");

class UsersController {
  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role } = req.query;

      const result = await userService.getAllUsers(
        parseInt(page),
        parseInt(limit),
        role
      );

      success(res, result, "Users retrieved successfully");
    } catch (err) {
      console.error("Get all users error:", err);
      error(res, "Failed to retrieve users");
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      success(res, { user }, "User retrieved successfully");
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      console.error("Get user by ID error:", err);
      error(res, "Failed to retrieve user");
    }
  }
}

module.exports = new UsersController();
