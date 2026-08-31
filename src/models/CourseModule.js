"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CourseModule extends Model {
    static associate(models) {
      models.CourseModule.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      models.CourseModule.belongsTo(models.Batch, { foreignKey: "batchId", as: "batch" });
      models.CourseModule.hasMany(models.Lesson, { foreignKey: "moduleId", as: "lessons" });
    }
  }

  CourseModule.init(
    {
      courseId: { type: DataTypes.INTEGER },
      batchId: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "CourseModule", tableName: "CourseModules", timestamps: true }
  );

  return CourseModule;
};