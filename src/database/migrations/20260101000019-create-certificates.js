"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Certificates", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      studentId: { type: Sequelize.INTEGER, allowNull: true },
      courseId: { type: Sequelize.INTEGER, allowNull: true },
      certificateNumber: { type: Sequelize.STRING, allowNull: true },
      issuedAt: { type: Sequelize.DATE, allowNull: true },
      fileUrl: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Certificates");
  },
};
