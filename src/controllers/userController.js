const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");
const userService = require("../services/userService");

const userController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, search, roleId } = req.query;
    const result = await userService.list({ page, limit, search, roleId });
    return success(res, {
      message: "Users fetched successfully",
      data: { items: result.items, total: result.total },
      meta: { page: result.page, totalPages: result.totalPages },
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);
    if (!user) return failure(res, { statusCode: 404, message: "User not found" });
    return success(res, { message: "User fetched successfully", data: user });
  }),

  create: asyncHandler(async (req, res) => {
    const user = await userService.create(req.body, req.user.id, req);
    return success(res, { statusCode: 201, message: "User created successfully", data: user });
  }),

  update: asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id, req.body, req.user.id, req);
    return success(res, { message: "User updated successfully", data: user });
  }),

  remove: asyncHandler(async (req, res) => {
    await userService.remove(req.params.id, req.user.id, req);
    return success(res, { message: "User deleted successfully" });
  }),

  enable: asyncHandler(async (req, res) => {
    const user = await userService.setActive(req.params.id, true, req.user.id, req);
    return success(res, { message: "User enabled successfully", data: user });
  }),

  disable: asyncHandler(async (req, res) => {
    const user = await userService.setActive(req.params.id, false, req.user.id, req);
    return success(res, { message: "User disabled successfully", data: user });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const result = await userService.resetPassword(req.params.id, req.user.id, req);
    return success(res, { message: "Password reset successfully", data: result });
  }),

  assignRole: asyncHandler(async (req, res) => {
    const user = await userService.assignRole(req.params.id, req.body.roleId, req.user.id, req);
    return success(res, { message: "Role assigned successfully", data: user });
  }),

  loginHistory: asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await userService.getLoginHistory(req.params.id, { page, limit });
    return success(res, {
      message: "Login history fetched successfully",
      data: { items: result.items, total: result.total },
      meta: { page: result.page, totalPages: result.totalPages },
    });
  }),

  activityHistory: asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await userService.getActivityHistory(req.params.id, { page, limit });
    return success(res, {
      message: "Activity history fetched successfully",
      data: { items: result.items, total: result.total },
      meta: { page: result.page, totalPages: result.totalPages },
    });
  }),
};

module.exports = userController;
