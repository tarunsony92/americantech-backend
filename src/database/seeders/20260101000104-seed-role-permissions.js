"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(`SELECT id, name FROM "Roles";`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const permissions = await queryInterface.sequelize.query(`SELECT id, name FROM "Permissions";`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const roleId = (name) => roles.find((r) => r.name === name)?.id;
    const permId = (name) => permissions.find((p) => p.name === name)?.id;
    const now = new Date();

    const grants = [];

    // admin: every permission in the catalog.
    const adminRoleId = roleId("admin");
    if (adminRoleId) {
      permissions.forEach((p) => grants.push({ roleId: adminRoleId, permissionId: p.id, createdAt: now, updatedAt: now }));
    }

    // instructor: read access to students/enrollments/applications, write access to
    // courses/blogs/jobs (their own teaching content) — not roles/permissions/settings/users.
    const instructorRoleId = roleId("instructor");
    const instructorPermissions = [
      "students:read",
      "enrollments:read",
      "courses:write",
      "blogs:write",
      "jobs:write",
      "job-applications:read",
    ];
    if (instructorRoleId) {
      instructorPermissions.forEach((name) => {
        const id = permId(name);
        if (id) grants.push({ roleId: instructorRoleId, permissionId: id, createdAt: now, updatedAt: now });
      });
    }

    if (grants.length) {
      await queryInterface.bulkInsert("RolePermissions", grants);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("RolePermissions", null, {});
  },
};
