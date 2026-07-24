"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MenuItems", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      menuId: { type: Sequelize.INTEGER, allowNull: true },
      label: { type: Sequelize.STRING, allowNull: true },
      url: { type: Sequelize.STRING, allowNull: true },
      order: { type: Sequelize.INTEGER, allowNull: true },
      parentId: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("MenuItems");
  },
};
