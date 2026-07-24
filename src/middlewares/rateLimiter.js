const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

// General API traffic: generous, mainly to blunt scraping/abuse rather than normal usage.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Auth endpoints (login, register, forgot-password) are the actual brute-force target —
// much tighter limit, and keyed by IP+email so one attacker can't lock out other users
// sharing the same IP (e.g. an office network) by hammering a single account's login.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later." },
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email || ""}`,
});

module.exports = { apiLimiter, authLimiter };
