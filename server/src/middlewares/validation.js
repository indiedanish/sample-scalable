const Joi = require("joi");

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  // Video upload validation (for multipart form data)
  uploadVideo: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title must be less than 255 characters",
    }),
    description: Joi.string().max(5000).optional().allow("").messages({
      "string.max": "Description must be less than 5000 characters",
    }),
    isPublic: Joi.alternatives()
      .try(Joi.boolean(), Joi.string().valid("true", "false"))
      .optional()
      .default(true)
      .messages({
        "any.only": "isPublic must be true or false",
      }),
  }),

  // Video creation validation (for metadata only)
  createVideo: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title must be less than 255 characters",
    }),
    description: Joi.string().max(5000).optional().allow("").messages({
      "string.max": "Description must be less than 5000 characters",
    }),
    fileName: Joi.string().required().messages({
      "string.empty": "File name is required",
    }),
    fileSize: Joi.number().integer().min(1).required().messages({
      "number.base": "File size must be a number",
      "number.min": "File size must be greater than 0",
    }),
    blobUrl: Joi.string().uri().required().messages({
      "string.uri": "Blob URL must be a valid URL",
      "string.empty": "Blob URL is required",
    }),
    duration: Joi.number().integer().min(0).optional().allow(null).messages({
      "number.base": "Duration must be a number",
      "number.min": "Duration must be 0 or greater",
    }),
    isPublic: Joi.boolean().optional().default(true).messages({
      "boolean.base": "isPublic must be true or false",
    }),
  }),

  // Video update validation
  updateVideo: Joi.object({
    title: Joi.string().min(1).max(255).optional().messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title must be less than 255 characters",
    }),
    description: Joi.string().max(5000).optional().allow("").messages({
      "string.max": "Description must be less than 5000 characters",
    }),
    isPublic: Joi.boolean().optional().messages({
      "boolean.base": "isPublic must be true or false",
    }),
  }),

  // Generate upload URL validation
  generateUploadUrl: Joi.object({
    fileName: Joi.string().required().messages({
      "string.empty": "File name is required",
    }),
    contentType: Joi.string()
      .pattern(/^video\//)
      .required()
      .messages({
        "string.empty": "Content type is required",
        "string.pattern.base":
          "Content type must be a video MIME type (video/*)",
      }),
  }),

  // Comment validation
  createComment: Joi.object({
    content: Joi.string().min(1).max(1000).required().messages({
      "string.empty": "Comment content is required",
      "string.max": "Comment must be less than 1000 characters",
    }),
  }),

  // Rating validation
  createRating: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be between 1 and 5",
      "number.max": "Rating must be between 1 and 5",
      "any.required": "Rating is required",
    }),
    comment: Joi.string().max(1000).optional().allow("").messages({
      "string.max": "Rating comment must be less than 1000 characters",
    }),
  }),

  // User authentication validation
  signup: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "string.empty": "Password is required",
      }),
    firstName: Joi.string().min(2).max(50).required().messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be less than 50 characters",
      "string.empty": "First name is required",
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must be less than 50 characters",
      "string.empty": "Last name is required",
    }),
  }),

  // User login validation
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),

  // Create creator validation (admin only)
  createCreator: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "string.empty": "Password is required",
      }),
    firstName: Joi.string().min(2).max(50).required().messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must be less than 50 characters",
      "string.empty": "First name is required",
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must be less than 50 characters",
      "string.empty": "Last name is required",
    }),
  }),
};

module.exports = {
  validate,
  schemas,
};
