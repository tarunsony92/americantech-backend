const success = (res, { statusCode = 200, message = "Success", data = null, meta = null } = {}) =>
  res.status(statusCode).json({ success: true, message, data, ...(meta ? { meta } : {}) });

const failure = (res, { statusCode = 500, message = "Something went wrong", errors = null } = {}) =>
  res.status(statusCode).json({ success: false, message, ...(errors ? { errors } : {}) });

module.exports = { success, failure };
