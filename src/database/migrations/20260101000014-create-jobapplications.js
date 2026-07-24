"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("JobApplications", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      jobId: { type: Sequelize.INTEGER, allowNull: true },
      fullName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: true },
      resume: { type: Sequelize.STRING, allowNull: true },
      coverLetter: { type: Sequelize.TEXT, allowNull: true },
      statusId: { type: Sequelize.INTEGER, allowNull: true },
      userId: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("JobApplications");
  },
};
