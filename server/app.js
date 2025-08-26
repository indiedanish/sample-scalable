const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/config/swagger");

// Import routes
const authRoutes = require("./src/routes/auth");
const videoRoutes = require("./src/routes/videos");
const dashboardRoutes = require("./src/routes/dashboard");

// Import configurations
const { initializeContainers } = require("./src/config/cosmos");
const { initializeContainer } = require("./src/config/blob");

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Video Hub API",
  });
});

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Video Hub API Documentation",
  })
);

// API routes
app.use("/auth", authRoutes);
app.use("/creators", authRoutes); // This will handle POST /creators
app.use("/videos", videoRoutes);
app.use("/dashboard", dashboardRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Video Hub API",
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/health",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Handle Prisma errors
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry. Resource already exists.",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: "Record not found.",
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: err.details,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
});

// Initialize Azure services
const initializeServices = async () => {
  try {
    await Promise.all([initializeContainers(), initializeContainer()]);
    console.log("Azure services initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Azure services:", error);
    // Don't exit the process, let it continue for development
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

// Initialize services when app starts
initializeServices();

module.exports = app;
