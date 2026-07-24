const { failure } = require("../utils/apiResponse");

const notFoundHandler = (req, res) => {
  failure(res, { statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return failure(res, {
      statusCode: 400,
      message: "Validation failed",
      errors: err.errors?.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return failure(res, { statusCode: 401, message: "Invalid or expired token" });
  }

  const statusCode = err.statusCode || 500;
  return failure(res, {
    statusCode,
    message: err.message || "Internal server error",
    errors: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFoundHandler, errorHandler };
