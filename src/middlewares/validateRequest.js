const { validationResult } = require("express-validator");
const { failure } = require("../utils/apiResponse");

// Place after any express-validator chain to short-circuit on validation errors.
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, {
      statusCode: 422,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
};

module.exports = validateRequest;
