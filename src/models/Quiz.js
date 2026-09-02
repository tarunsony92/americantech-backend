
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {
      // Quiz belongs to Batch
      models.Quiz.belongsTo(models.Batch, {
        foreignKey: "batchId",
        as: "batch",
      });

      // Quiz has many questions
      models.Quiz.hasMany(models.QuizQuestion, {
        foreignKey: "quizId",
        as: "questions",
        onDelete: "CASCADE",
      });

      // Quiz has many attempts
      models.Quiz.hasMany(models.QuizAttempt, {
        foreignKey: "quizId",
        as: "attempts",
        onDelete: "CASCADE",
      });
    }
  }

  Quiz.init(
    {
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Null means untimed quiz",
      },

      passingScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Passing percentage",
      },

      maxAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      status: {
        type: DataTypes.ENUM(
          "draft",
          "published",
          "closed"
        ),
        defaultValue: "draft",
      },
    },
    {
      sequelize,
      modelName: "Quiz",
      tableName: "Quizzes",
      timestamps: true,
    }
  );

  return Quiz;
};
