const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");
const authService = require("../services/authService");

// Pulls device/session info off the request for RefreshToken rows (device tracking, and so a
// user can later see "which devices am I logged in on").
const requestMeta = (req) => ({
  userAgent: req.headers["user-agent"] || null,
  ipAddress: req.ip,
});

const authController = {
  register: asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    return success(res, { statusCode: 201, message: "Account created successfully", data: user });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body, requestMeta(req));
    return success(res, { message: "Logged in successfully", data: result });
  }),

  refreshToken: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return failure(res, { statusCode: 400, message: "Refresh token is required" });
    }
    const result = await authService.refresh(refreshToken, requestMeta(req));
    return success(res, { message: "Token refreshed", data: result });
  }),

  // Revokes only the session tied to the refresh token this device holds — other devices
  // the user is logged in on stay logged in.
  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    return success(res, { message: "Logged out successfully" });
  }),

  // Revokes every session for the current user (log out of all devices).
  logoutAll: asyncHandler(async (req, res) => {
    await authService.logoutAllSessions(req.user.id);
    return success(res, { message: "Logged out of all devices successfully" });
  }),

  getProfile: asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    return success(res, { message: "Profile fetched successfully", data: user });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    return success(res, { message: "Profile updated successfully", data: user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    await authService.changePassword(req.user.id, req.body);
    return success(res, { message: "Password changed successfully" });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    return success(res, { message: "If that email exists, a reset link has been sent" });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body);
    return success(res, { message: "Password reset successfully" });
  }),
};

module.exports = authController;
