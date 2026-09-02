"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QuizOption extends Model {
    static associate(models) {
      models.QuizOption.belongsTo(models.QuizQuestion, { foreignKey: "questionId", as: "question" });
    }
  }

  QuizOption.init(
    {
      questionId: { type: DataTypes.INTEGER, allowNull: false },
      optionText: { type: DataTypes.STRING, allowNull: false },
      isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, modelName: "QuizOption", tableName: "QuizOptions", timestamps: true }
  );

  return QuizOption;
};