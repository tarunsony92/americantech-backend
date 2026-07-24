"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "lastLoginAt", { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn("Users", "lastLoginIp", { type: Sequelize.STRING, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Users", "lastLoginAt");
    await queryInterface.removeColumn("Users", "lastLoginIp");
  },
};
