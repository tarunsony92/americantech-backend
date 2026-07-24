"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
            models.User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
      models.User.hasOne(models.Student, { foreignKey: "userId", as: "studentProfile" });
      models.User.hasMany(models.Blog, { foreignKey: "authorId", as: "blogs" });
      models.User.hasMany(models.JobApplication, { foreignKey: "userId", as: "applications" });
      models.User.hasMany(models.RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
      models.User.hasMany(models.ActivityLog, { foreignKey: "userId", as: "activityLogs" });
    }
  }

  User.init(
    {
      fullName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      roleId: { type: DataTypes.INTEGER },
      avatar: { type: DataTypes.STRING },
      isActive: { type: DataTypes.BOOLEAN },
      isEmailVerified: { type: DataTypes.BOOLEAN },
      passwordResetToken: { type: DataTypes.STRING },
      passwordResetExpires: { type: DataTypes.DATE },
      lastLoginAt: { type: DataTypes.DATE },
      lastLoginIp: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "User", tableName: "Users", timestamps: true }
  );

  return User;
};
