// Role-based access control middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required.",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      console.error("RBAC middleware error:", error);
      res.status(500).json({
        error: "Internal server error during authorization.",
      });
    }
  };
};

// Specific role middlewares for convenience
const requireAdmin = authorize("ADMIN");
const requireCreator = authorize("ADMIN", "CREATOR");
const requireConsumer = authorize("ADMIN", "CREATOR", "CONSUMER");

// Check if user is the owner of a resource or has admin privileges
const requireOwnershipOrAdmin = (
  resourceIdField = "id",
  userIdField = "creatorId"
) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required.",
        });
      }

      // Admin can access anything
      if (req.user.role === "ADMIN") {
        return next();
      }

      const resourceId = req.params[resourceIdField];

      // This will be used by controllers to check ownership
      req.checkOwnership = {
        resourceId,
        userIdField,
        userId: req.user.id,
      };

      next();
    } catch (error) {
      console.error("Ownership middleware error:", error);
      res.status(500).json({
        error: "Internal server error during ownership check.",
      });
    }
  };
};

module.exports = {
  authorize,
  requireAdmin,
  requireCreator,
  requireConsumer,
  requireOwnershipOrAdmin,
};
