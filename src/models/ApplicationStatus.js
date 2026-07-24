"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ApplicationStatus extends Model {
    static associate(models) {
            models.ApplicationStatus.hasMany(models.JobApplication, { foreignKey: "statusId", as: "applications" });
    }
  }

  ApplicationStatus.init(
    {
      name: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "ApplicationStatus", tableName: "ApplicationStatuses", timestamps: true }
  );

  return ApplicationStatus;
};
