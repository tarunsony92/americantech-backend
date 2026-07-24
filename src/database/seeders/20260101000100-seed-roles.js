"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("Roles", [
      { name: "admin", description: "Full administrative access", createdAt: now, updatedAt: now },
      { name: "instructor", description: "Manages courses and student progress", createdAt: now, updatedAt: now },
      { name: "student", description: "Default role for registered learners", createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
