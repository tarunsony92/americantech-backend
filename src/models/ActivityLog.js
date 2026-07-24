"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      models.ActivityLog.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      models.ActivityLog.belongsTo(models.User, { foreignKey: "actorId", as: "actor" });
    }
  }

  ActivityLog.init(
    {
      userId: { type: DataTypes.INTEGER },
      actorId: { type: DataTypes.INTEGER },
      action: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      ipAddress: { type: DataTypes.STRING },
      userAgent: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "ActivityLog", tableName: "ActivityLogs", timestamps: true }
  );

  return ActivityLog;
};
