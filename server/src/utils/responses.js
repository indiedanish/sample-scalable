// Standardized API responses

const success = (res, data = null, message = "Success", statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const error = (
  res,
  message = "An error occurred",
  statusCode = 500,
  details = null
) => {
  const response = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

const validationError = (res, details) => {
  return error(res, "Validation failed", 400, details);
};

const notFound = (res, resource = "Resource") => {
  return error(res, `${resource} not found`, 404);
};

const unauthorized = (res, message = "Unauthorized access") => {
  return error(res, message, 401);
};

const forbidden = (res, message = "Access forbidden") => {
  return error(res, message, 403);
};

const conflict = (res, message = "Resource already exists") => {
  return error(res, message, 409);
};

module.exports = {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  conflict,
};
