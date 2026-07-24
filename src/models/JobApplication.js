"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JobApplication extends Model {
    static associate(models) {
            models.JobApplication.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
      models.JobApplication.belongsTo(models.ApplicationStatus, { foreignKey: "statusId", as: "status" });
      models.JobApplication.belongsTo(models.User, { foreignKey: "userId", as: "applicant" });
    }
  }

  JobApplication.init(
    {
      jobId: { type: DataTypes.INTEGER },
      fullName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      resume: { type: DataTypes.STRING },
      coverLetter: { type: DataTypes.TEXT },
      statusId: { type: DataTypes.INTEGER },
      userId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "JobApplication", tableName: "JobApplications", timestamps: true }
  );

  return JobApplication;
};
