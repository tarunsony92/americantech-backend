// Wraps an async controller so rejected promises are forwarded to Express's error handler
// instead of crashing the process. Every controller in this project is wrapped with this.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
