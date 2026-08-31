"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {
      models.Batch.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      models.Batch.hasMany(models.CourseModule, { foreignKey: "batchId", as: "modules" });
      models.Batch.hasMany(models.Enrollment, { foreignKey: "batchId", as: "enrollments" });
    }
  }

  Batch.init(
    {
      courseId: { type: DataTypes.INTEGER },
      name: { type: DataTypes.STRING },
      startDate: { type: DataTypes.DATEONLY },
      endDate: { type: DataTypes.DATEONLY },
      status: {
        type: DataTypes.ENUM("upcoming", "ongoing", "completed"),
        defaultValue: "upcoming",
      },
    },
    { sequelize, modelName: "Batch", tableName: "Batches", timestamps: true }
  );

  return Batch;
};