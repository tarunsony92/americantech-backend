"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QuizQuestion extends Model {
    static associate(models) {
      models.QuizQuestion.belongsTo(models.Quiz, { foreignKey: "quizId", as: "quiz" });
      models.QuizQuestion.hasMany(models.QuizOption, { foreignKey: "questionId", as: "options" });
      models.QuizQuestion.hasMany(models.QuizAnswer, { foreignKey: "questionId", as: "answers" });
    }
  }

  QuizQuestion.init(
    {
      quizId: { type: DataTypes.INTEGER, allowNull: false },
      questionText: { type: DataTypes.TEXT, allowNull: false },
      questionType: {
        type: DataTypes.ENUM("single", "multiple"), // single-correct or multi-correct MCQ
        defaultValue: "single",
      },
      marks: { type: DataTypes.INTEGER, defaultValue: 1 },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, modelName: "QuizQuestion", tableName: "QuizQuestions", timestamps: true }
  );

  return QuizQuestion;
};