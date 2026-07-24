"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
            models.Lesson.belongsTo(models.CourseModule, { foreignKey: "moduleId", as: "module" });
    }
  }

  Lesson.init(
    {
      moduleId: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      content: { type: DataTypes.TEXT },
      videoUrl: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "Lesson", tableName: "Lessons", timestamps: true }
  );

  return Lesson;
};
