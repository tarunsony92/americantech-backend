"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint("Enrollments", {
      fields: ["studentId", "courseId"],
      type: "unique",
      name: "unique_student_course_enrollment",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("Enrollments", "unique_student_course_enrollment");
  },
};
