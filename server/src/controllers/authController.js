const userService = require("../services/userService");
const {
  success,
  error,
  conflict,
  unauthorized,
} = require("../utils/responses");

class AuthController {
  // Consumer signup
  async signup(req, res) {
    try {
      const user = await userService.createUser(req.body, "CONSUMER");
      success(res, { user }, "User registered successfully", 201);
    } catch (err) {
      if (err.message === "User with this email already exists") {
        conflict(res, err.message);
      } else {
        console.error("Signup error:", err);
        error(res, "Registration failed");
      }
    }
  }

  // Login for all users
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.authenticateUser(email, password);
      success(res, result, "Login successful");
    } catch (err) {
      if (err.message === "Invalid credentials") {
        unauthorized(res, err.message);
      } else {
        console.error("Login error:", err);
        error(res, "Login failed");
      }
    }
  }

  // Admin creates creator user
  async createCreator(req, res) {
    try {
      const user = await userService.createUser(req.body, "CREATOR");
      success(res, { user }, "Creator user created successfully", 201);
    } catch (err) {
      if (err.message === "User with this email already exists") {
        conflict(res, err.message);
      } else {
        console.error("Create creator error:", err);
        error(res, "Failed to create creator user");
      }
    }
  }

  // Get current user info
  async getMe(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);
      success(res, { user }, "User information retrieved successfully");
    } catch (err) {
      console.error("Get me error:", err);
      error(res, "Failed to get user information");
    }
  }
}

module.exports = new AuthController();
