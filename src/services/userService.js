const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { User, Role, RefreshToken, ActivityLog, Student, Enrollment } = require("../models");
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

// Looks up the student's current course assignment (most recent enrollment), if any.
// Returns null for non-students or students with no enrollment yet.
const getAssignedCourseId = async (userId) => {
  const student = await Student.findOne({ where: { userId } });
  if (!student) return null;

  const latestEnrollment = await Enrollment.findOne({
    where: { studentId: student.id },
    order: [["createdAt", "DESC"]],
  });

  return latestEnrollment ? latestEnrollment.courseId : null;
};

const userService = {
  async list({ page = 1, limit = 10, search = "", roleId, courseId } = {}) {
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

    // Attach each user's currently assigned course (if any) so the table/edit form can show it.
    const items = await Promise.all(
      rows.map(async (row) => {
        const plain = row.toJSON();
        plain.courseId = await getAssignedCourseId(row.id);
        return plain;
      })
    );

    const filtered = courseId
      ? items.filter((u) => String(u.courseId) === String(courseId))
      : items;

    return {
      items: filtered,
      total: count,
      page: Number(page),
      totalPages: Math.max(1, Math.ceil(count / Number(limit))),
    };
  },

  async getById(id) {
    const user = await User.findByPk(id, {
      attributes: PUBLIC_ATTRS,
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    if (!user) return null;

    const plainUser = user.toJSON();
    plainUser.courseId = await getAssignedCourseId(id);
    return plainUser;
  },

  async create({ fullName, email, password, phone, roleId, courseId }, actorId, req) {
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

    // If a course was picked while creating the user, enroll them.
    // Only makes sense for students, and only if a course was actually selected.
    if (courseId) {
      const role = await Role.findByPk(roleId);

      if (role && role.name.toLowerCase() === "student") {
        const [student] = await Student.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, enrollmentCount: 0 },
        });

        await Enrollment.create({
          studentId: student.id,
          courseId,
          status: "active",
          progress: 0,
          enrolledAt: new Date(),
        });

        await student.increment("enrollmentCount");

        await logActivity({
          userId: user.id,
          actorId,
          action: "user.course_assigned",
          description: `Assigned course ${courseId} to ${email}`,
          req,
        });
      }
    }

    return userService.getById(user.id);
  },

  async update(id, { fullName, phone, roleId, courseId }, actorId, req) {
    const user = await User.findByPk(id);
    if (!user) throw notFound();
    await user.update({ fullName, phone, roleId });
    await logActivity({ userId: id, actorId, action: "user.updated", req });

    if (courseId) {
      const role = await Role.findByPk(roleId || user.roleId);

      if (role && role.name.toLowerCase() === "student") {
        const [student] = await Student.findOrCreate({
          where: { userId: id },
          defaults: { userId: id, enrollmentCount: 0 },
        });

        const [enrollment, created] = await Enrollment.findOrCreate({
          where: { studentId: student.id, courseId },
          defaults: { status: "active", progress: 0, enrolledAt: new Date() },
        });

        if (created) {
          await student.increment("enrollmentCount");
        }

        await logActivity({
          userId: id, actorId, action: "user.course_assigned",
          description: `Assigned course ${courseId}`, req,
        });
      }
    }

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