"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QuizAttempt extends Model {
    static associate(models) {
      models.QuizAttempt.belongsTo(models.Quiz, { foreignKey: "quizId", as: "quiz" });
      models.QuizAttempt.belongsTo(models.Enrollment, { foreignKey: "enrollmentId", as: "enrollment" });
      models.QuizAttempt.hasMany(models.QuizAnswer, { foreignKey: "attemptId", as: "answers" });
    }
  }

  QuizAttempt.init(
    {
      quizId: { type: DataTypes.INTEGER, allowNull: false },
      enrollmentId: { type: DataTypes.INTEGER, allowNull: false },
      attemptNumber: { type: DataTypes.INTEGER, defaultValue: 1 },
      startedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      submittedAt: { type: DataTypes.DATE, allowNull: true },
      totalMarks: { type: DataTypes.INTEGER, defaultValue: 0 },
      scoredMarks: { type: DataTypes.INTEGER, defaultValue: 0 },
      percentage: { type: DataTypes.FLOAT, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM("in_progress", "submitted", "evaluated"),
        defaultValue: "in_progress",
      },
      passed: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "QuizAttempt", tableName: "QuizAttempts", timestamps: true }
  );

  return QuizAttempt;
};