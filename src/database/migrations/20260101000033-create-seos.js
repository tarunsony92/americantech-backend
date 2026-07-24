"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SEOs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      pageId: { type: Sequelize.INTEGER, allowNull: true },
      metaTitle: { type: Sequelize.STRING, allowNull: true },
      metaDescription: { type: Sequelize.TEXT, allowNull: true },
      ogImage: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("SEOs");
  },
};
