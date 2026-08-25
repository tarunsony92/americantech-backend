"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LessonNote extends Model {
    static associate(models) {
      models.LessonNote.belongsTo(models.Lesson, { foreignKey: "lessonId", as: "lesson" });
    }
  }

  LessonNote.init(
    {
      lessonId: { type: DataTypes.INTEGER },
      fileName: { type: DataTypes.STRING },
      originalName: { type: DataTypes.STRING },
      fileUrl: { type: DataTypes.STRING },
      mimeType: { type: DataTypes.STRING },
      fileSize: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "LessonNote", tableName: "LessonNotes", timestamps: true }
  );

  return LessonNote;
};