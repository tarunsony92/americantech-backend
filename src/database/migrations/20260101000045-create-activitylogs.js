"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ActivityLogs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "Users", key: "id" }, onDelete: "SET NULL" },
      // Who performed the action, if different from the target user (e.g. admin editing another
      // user's account) — null means the actor and the subject (userId) are the same.
      actorId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "Users", key: "id" }, onDelete: "SET NULL" },
      action: { type: Sequelize.STRING, allowNull: false }, // e.g. "user.login", "user.disabled", "student.created"
      description: { type: Sequelize.TEXT, allowNull: true },
      ipAddress: { type: Sequelize.STRING, allowNull: true },
      userAgent: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex("ActivityLogs", ["userId"]);
    await queryInterface.addIndex("ActivityLogs", ["action"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ActivityLogs");
  },
};
