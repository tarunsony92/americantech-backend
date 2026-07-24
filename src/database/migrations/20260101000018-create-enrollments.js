"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Enrollments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      studentId: { type: Sequelize.INTEGER, allowNull: true },
      courseId: { type: Sequelize.INTEGER, allowNull: true },
      progress: { type: Sequelize.INTEGER, allowNull: true },
      status: { type: Sequelize.STRING, allowNull: true },
      enrolledAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Enrollments");
  },
};
