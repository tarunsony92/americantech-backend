"use strict";

// resource:action naming, one row per permission the app actually checks against.
const PERMISSIONS = [
  ["students:read", "View student records"],
  ["students:write", "Create/update/delete student records"],
  ["enrollments:read", "View enrollments"],
  ["enrollments:write", "Create/update/delete enrollments"],
  ["courses:write", "Create/update/delete courses"],
  ["blogs:write", "Create/update/delete blog posts"],
  ["jobs:write", "Create/update/delete job postings"],
  ["job-applications:read", "View job applications"],
  ["job-applications:write", "Update/delete job applications"],
  ["contact-queries:read", "View contact form submissions"],
  ["contact-queries:write", "Update/delete contact form submissions"],
  ["newsletters:read", "View newsletter subscribers"],
  ["newsletters:write", "Update/delete newsletter subscribers"],
  ["roles:write", "Manage roles"],
  ["permissions:write", "Manage permissions and role assignments"],
  ["users:read", "View user accounts"],
  ["users:write", "Create/update/delete/enable/disable user accounts"],
  ["settings:write", "Modify site settings"],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Permissions",
      PERMISSIONS.map(([name, description]) => ({ name, description, createdAt: now, updatedAt: now }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Permissions", null, {});
  },
};
