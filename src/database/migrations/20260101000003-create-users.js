"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      fullName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      roleId: { type: Sequelize.INTEGER, allowNull: true },
      avatar: { type: Sequelize.STRING, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: true },
      isEmailVerified: { type: Sequelize.BOOLEAN, allowNull: true },
      passwordResetToken: { type: Sequelize.STRING, allowNull: true },
      passwordResetExpires: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
