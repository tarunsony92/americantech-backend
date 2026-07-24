const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, Role, RefreshToken } = require("../models");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  refreshTokenExpiryDate,
} = require("../helpers/tokenHelper");
const { logActivity } = require("../helpers/activityLogger");
const { sendMail } = require("./mailService");

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role?.name || "student",
});

// Issues a fresh access+refresh pair and persists the refresh token (hashed) as a session row,
// tagged with the requesting device so multiple concurrent device sessions are tracked separately.
const issueSession = async (user, meta = {}) => {
  const tokenPayload = { id: user.id, role: user.role?.name };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    userAgent: meta.userAgent || null,
    ipAddress: meta.ipAddress || null,
    expiresAt: refreshTokenExpiryDate(),
  });

  return { accessToken, refreshToken };
};

const authService = {
  async register({ fullName, email, password, phone }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const err = new Error("An account with this email already exists");
      err.statusCode = 409;
      throw err;
    }

    const studentRole = await Role.findOne({ where: { name: "student" } });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      roleId: studentRole?.id || null,
      isActive: true,
      isEmailVerified: false,
    });

    return sanitizeUser({ ...user.toJSON(), role: studentRole });
  },

  async login({ email, password }, meta = {}) {
    const user = await User.findOne({ where: { email }, include: [{ model: Role, as: "role" }] });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err = new Error("This account has been deactivated");
      err.statusCode = 403;
      throw err;
    }

    const { accessToken, refreshToken } = await issueSession(user, meta);

    user.lastLoginAt = new Date();
    user.lastLoginIp = meta.ipAddress || null;
    await user.save();
    await logActivity({ userId: user.id, action: "user.login", req: { ip: meta.ipAddress, headers: { "user-agent": meta.userAgent } } });

    return { accessToken, refreshToken, user: sanitizeUser(user) };
  },

  // Rotates the refresh token: the presented token is verified, matched against its stored hash,
  // and immediately revoked; a brand new access+refresh pair is issued and stored in its place.
  // If a token that was already revoked/rotated is presented again, that's a replay signal (the
  // token was likely stolen and used by two parties) — every session for that user is revoked
  // so both the legitimate and attacking client are forced to log in again.
  async refresh(refreshToken, meta = {}) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      const err = new Error("Invalid or expired refresh token");
      err.statusCode = 401;
      throw err;
    }

    const presentedHash = hashToken(refreshToken);
    const tokenRow = await RefreshToken.findOne({ where: { tokenHash: presentedHash } });

    if (!tokenRow) {
      const err = new Error("Invalid session, please log in again");
      err.statusCode = 401;
      throw err;
    }

    if (tokenRow.revokedAt) {
      // Replay: this exact refresh token was already rotated away once before.
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { userId: tokenRow.userId, revokedAt: null } }
      );
      const err = new Error("Session invalidated due to suspicious reuse. Please log in again.");
      err.statusCode = 401;
      throw err;
    }

    if (tokenRow.expiresAt < new Date()) {
      const err = new Error("Refresh token has expired, please log in again");
      err.statusCode = 401;
      throw err;
    }

    const user = await User.findByPk(decoded.id, { include: [{ model: Role, as: "role" }] });
    if (!user || !user.isActive) {
      const err = new Error("Invalid session, please log in again");
      err.statusCode = 401;
      throw err;
    }

    const { accessToken, refreshToken: newRefreshToken } = await issueSession(user, meta);

    tokenRow.revokedAt = new Date();
    tokenRow.replacedByTokenHash = hashToken(newRefreshToken);
    await tokenRow.save();

    return { accessToken, refreshToken: newRefreshToken };
  },

  // Revokes just the session tied to the presented refresh token (i.e. this device only),
  // leaving the user's other device sessions untouched.
  async logout(refreshToken) {
    if (!refreshToken) return true;
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.update({ revokedAt: new Date() }, { where: { tokenHash, revokedAt: null } });
    return true;
  },

  // Revokes every active session for a user (e.g. "log out of all devices", or forced on
  // password change / account disable).
  async logoutAllSessions(userId) {
    await RefreshToken.update({ revokedAt: new Date() }, { where: { userId, revokedAt: null } });
    return true;
  },

  async getProfile(userId) {
    const user = await User.findByPk(userId, { include: [{ model: Role, as: "role" }] });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    return sanitizeUser(user);
  },

  async updateProfile(userId, { fullName, phone, avatar }) {
    const user = await User.findByPk(userId, { include: [{ model: Role, as: "role" }] });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    await user.update({ fullName, phone, avatar });
    return sanitizeUser(user);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findByPk(userId);
    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      const err = new Error("Current password is incorrect");
      err.statusCode = 400;
      throw err;
    }
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    // Changing the password invalidates every existing session — a stolen refresh token from
    // before the change should not keep working after the owner has reacted to a compromise.
    await authService.logoutAllSessions(userId);
    return true;
  },

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    // Always resolve without revealing whether the email exists, to avoid user enumeration.
    if (!user) return true;

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return true;
  },

  async resetPassword({ token, newPassword }) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      where: { passwordResetToken: hashedToken },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      const err = new Error("Reset token is invalid or has expired");
      err.statusCode = 400;
      throw err;
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    await authService.logoutAllSessions(user.id);
    return true;
  },
};

module.exports = authService;
