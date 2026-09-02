"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QuizAnswer extends Model {
    static associate(models) {
      models.QuizAnswer.belongsTo(models.QuizAttempt, { foreignKey: "attemptId", as: "attempt" });
      models.QuizAnswer.belongsTo(models.QuizQuestion, { foreignKey: "questionId", as: "question" });
      models.QuizAnswer.belongsTo(models.QuizOption, { foreignKey: "selectedOptionId", as: "selectedOption" });
    }
  }

  QuizAnswer.init(
    {
      attemptId: { type: DataTypes.INTEGER, allowNull: false },
      questionId: { type: DataTypes.INTEGER, allowNull: false },
      // For "single" type questions. For "multiple" type, selectedOptionIds (JSON array) is used instead.
      selectedOptionId: { type: DataTypes.INTEGER, allowNull: true },
      selectedOptionIds: { type: DataTypes.JSON, allowNull: true },
      isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
      marksAwarded: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, modelName: "QuizAnswer", tableName: "QuizAnswers", timestamps: true }
  );

  return QuizAnswer;
};