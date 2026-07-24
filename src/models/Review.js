"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
            models.Review.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      models.Review.belongsTo(models.Student, { foreignKey: "studentId", as: "student" });
    }
  }

  Review.init(
    {
      courseId: { type: DataTypes.INTEGER },
      studentId: { type: DataTypes.INTEGER },
      rating: { type: DataTypes.INTEGER },
      comment: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "Review", tableName: "Reviews", timestamps: true }
  );

  return Review;
};
