"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("ApplicationStatuses", [
      { name: "Applied", createdAt: now, updatedAt: now },
      { name: "Shortlisted", createdAt: now, updatedAt: now },
      { name: "Interviewing", createdAt: now, updatedAt: now },
      { name: "Selected", createdAt: now, updatedAt: now },
      { name: "Rejected", createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ApplicationStatuses", null, {});
  },
};
