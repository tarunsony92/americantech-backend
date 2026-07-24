"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RefreshTokens", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
      // SHA-256 hash of the raw refresh token — the raw token is never stored, only sent to the client.
      tokenHash: { type: Sequelize.STRING, allowNull: false, unique: true },
      userAgent: { type: Sequelize.STRING, allowNull: true },
      ipAddress: { type: Sequelize.STRING, allowNull: true },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      revokedAt: { type: Sequelize.DATE, allowNull: true },
      // Points at the tokenHash that replaced this one when rotated, so a reused/stolen token
      // (presented again after it's already been rotated) can be detected as a replay.
      replacedByTokenHash: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex("RefreshTokens", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("RefreshTokens");
  },
};
