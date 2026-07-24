"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SuccessStory extends Model {
    static associate(models) {
            models.SuccessStory.belongsTo(models.Student, { foreignKey: "studentId", as: "student" });
    }
  }

  SuccessStory.init(
    {
      name: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING },
      summary: { type: DataTypes.TEXT },
      image: { type: DataTypes.STRING },
      studentId: { type: DataTypes.INTEGER },
      isPublished: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "SuccessStory", tableName: "SuccessStories", timestamps: true }
  );

  return SuccessStory;
};
