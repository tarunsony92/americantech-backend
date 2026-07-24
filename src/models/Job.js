"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
            models.Job.belongsTo(models.HiringPartner, { foreignKey: "companyId", as: "company" });
      models.Job.belongsTo(models.CareerCategory, { foreignKey: "categoryId", as: "category" });
      models.Job.hasMany(models.JobApplication, { foreignKey: "jobId", as: "applications" });
    }
  }

  Job.init(
    {
      title: { type: DataTypes.STRING },
      companyId: { type: DataTypes.INTEGER },
      location: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      requirements: { type: DataTypes.TEXT },
      categoryId: { type: DataTypes.INTEGER },
      isActive: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "Job", tableName: "Jobs", timestamps: true }
  );

  return Job;
};
