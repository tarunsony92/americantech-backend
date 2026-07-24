"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      models.RefreshToken.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  RefreshToken.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      tokenHash: { type: DataTypes.STRING, allowNull: false, unique: true },
      userAgent: { type: DataTypes.STRING },
      ipAddress: { type: DataTypes.STRING },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      revokedAt: { type: DataTypes.DATE },
      replacedByTokenHash: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "RefreshToken", tableName: "RefreshTokens", timestamps: true }
  );

  return RefreshToken;
};
