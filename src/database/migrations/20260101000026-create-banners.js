"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Banners", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      subtitle: { type: Sequelize.STRING, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      ctaLabel: { type: Sequelize.STRING, allowNull: true },
      ctaLink: { type: Sequelize.STRING, allowNull: true },
      order: { type: Sequelize.INTEGER, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Banners");
  },
};
