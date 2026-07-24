"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Courses", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: true },
      categoryId: { type: Sequelize.INTEGER, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      duration: { type: Sequelize.STRING, allowNull: true },
      level: { type: Sequelize.STRING, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      rating: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      isPublished: { type: Sequelize.BOOLEAN, allowNull: true },
      instructorId: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Courses");
  },
};
