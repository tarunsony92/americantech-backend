"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [[adminRole]] = await queryInterface.sequelize.query(`SELECT id FROM "Roles" WHERE name = 'admin' LIMIT 1;`);
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    await queryInterface.bulkInsert("Users", [
      {
        fullName: "Site Administrator",
        email: "admin@americantechglobal.com",
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
        isEmailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", { email: "admin@americantechglobal.com" }, {});
  },
};
