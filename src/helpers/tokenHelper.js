const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

// Every refresh token gets a random jti so two tokens issued in the same second for the
// same user still hash to different values (needed since tokenHash is unique in the DB).
const signRefreshToken = (payload) =>
  jwt.sign({ ...payload, jti: crypto.randomBytes(16).toString("hex") }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// Refresh tokens are stored hashed (never raw) so a DB leak alone can't be used to log in.
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// Parses a jsonwebtoken-style duration string ("15m", "7d", "1h", "30s") or a plain number of
// seconds into a millisecond offset, so callers can compute a concrete expiresAt for storage.
const parseDurationMs = (duration) => {
  if (typeof duration === "number") return duration * 1000;
  const match = /^(\d+)([smhd])$/.exec(String(duration).trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000; // sane fallback: 7 days
  const value = Number(match[1]);
  const unitMs = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 }[match[2]];
  return value * unitMs;
};

const refreshTokenExpiryDate = () => new Date(Date.now() + parseDurationMs(REFRESH_EXPIRES_IN));

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  refreshTokenExpiryDate,
};
