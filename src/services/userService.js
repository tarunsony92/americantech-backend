const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { User, Role, RefreshToken, ActivityLog } = require("../models");
const { logActivity } = require("../helpers/activityLogger");

const SALT_ROUNDS = 10;
const PUBLIC_ATTRS = [
  "id", "fullName", "email", "phone", "avatar", "roleId",
  "isActive", "isEmailVerified", "lastLoginAt", "lastLoginIp",
  "createdAt", "updatedAt",
]; // deliberately excludes password / passwordResetToken / passwordResetExpires

const notFound = (message = "User not found") => {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
};

const userService = {
  async list({ page = 1, limit = 10, search = "", roleId } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const where = {};
    if (roleId) where.roleId = roleId;
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: PUBLIC_ATTRS,
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    return {
      items: rows,
      total: count,
      page: Number(page),
      totalPages: Math.max(1, Math.ceil(count / Number(limit))),
    };
  },

  async getById(id) {
    return User.findByPk(id, {
      attributes: PUBLIC_ATTRS,
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });
  },

  async create({ fullName, email, password, phone, roleId }, actorId, req) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const err = new Error("An account with this email already exists");
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      fullName, email, phone, roleId,
      password: hashedPassword,
      isActive: true,
      isEmailVerified: false,
    });

    await logActivity({ userId: user.id, actorId, action: "user.created", description: `Created user ${email}`, req });
    return userService.getById(user.id);
  },

  async update(id, { fullName, phone, roleId }, actorId, req) {
    const user = await User.findByPk(id);
    if (!user) throw notFound();
    await user.update({ fullName, phone, roleId });
    await logActivity({ userId: id, actorId, action: "user.updated", req });
    return userService.getById(id);
  },

  async remove(id, actorId, req) {
    const user = await User.findByPk(id);
    if (!user) throw notFound();
    await user.destroy();
    await logActivity({ userId: id, actorId, action: "user.deleted", description: `Deleted user ${user.email}`, req });
    return true;
  },

  async setActive(id, isActive, actorId, req) {
    const user = await User.findByPk(id);
    if (!user) throw notFound();
    user.isActive = isActive;
    await user.save();

    // Disabling an account must kill any live sessions immediately — otherwise a disabled
    // user with a still-valid access token keeps working for up to its 15-minute lifetime.
    if (!isActive) {
      await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: id, revokedAt: null } });
    }

    await logActivity({
      userId: id,
      actorId,
      action: isActive ? "user.enabled" : "user.disabled",
      req,
    });
    return userService.getById(id);
  },

  // Admin-triggered reset: generates a temporary password, invalidates all of the user's
  // sessions, and returns the temp password to the caller (the controller decides whether to
  // email it or return it directly — this service doesn't send mail itself).
  async resetPassword(id, actorId, req) {
    const user = await User.findByPk(id);
    if (!user) throw notFound();

    const tempPassword = crypto.randomBytes(9).toString("base64url"); // 12-char random string
    user.password = await bcrypt.hash(tempPassword, SALT_ROUNDS);
    await user.save();
    await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: id, revokedAt: null } });

    await logActivity({ userId: id, actorId, action: "user.password_reset_by_admin", req });
    return { tempPassword };
  },

  async assignRole(id, roleId, actorId, req) {
    const user = await User.findByPk(id);
    if (!user) throw notFound();
    const role = await Role.findByPk(roleId);
    if (!role) {
      const err = new Error("Role not found");
      err.statusCode = 404;
      throw err;
    }
    user.roleId = roleId;
    await user.save();
    await logActivity({ userId: id, actorId, action: "user.role_assigned", description: `Assigned role ${role.name}`, req });
    return userService.getById(id);
  },

  // Login history is derived from RefreshTokens — each row already IS a session, tagged with
  // device (userAgent) and IP at the time it was created.
  async getLoginHistory(id, { page = 1, limit = 20 } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await RefreshToken.findAndCountAll({
      where: { userId: id },
      attributes: ["id", "userAgent", "ipAddress", "createdAt", "expiresAt", "revokedAt"],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });
    return { items: rows, total: count, page: Number(page), totalPages: Math.max(1, Math.ceil(count / Number(limit))) };
  },

  async getActivityHistory(id, { page = 1, limit = 20 } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await ActivityLog.findAndCountAll({
      where: { userId: id },
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });
    return { items: rows, total: count, page: Number(page), totalPages: Math.max(1, Math.ceil(count / Number(limit))) };
  },
};

module.exports = userService;
