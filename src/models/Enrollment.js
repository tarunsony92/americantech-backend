"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      models.Enrollment.belongsTo(models.Student, { foreignKey: "studentId", as: "student" });
      models.Enrollment.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      models.Enrollment.belongsTo(models.Batch, { foreignKey: "batchId", as: "batch" });
    }
  }

  Enrollment.init(
    {
      studentId: { type: DataTypes.INTEGER },
      courseId: { type: DataTypes.INTEGER },
      batchId: { type: DataTypes.INTEGER },
      progress: { type: DataTypes.INTEGER },
      status: { type: DataTypes.STRING },
      enrolledAt: { type: DataTypes.DATE },
    },
    { sequelize, modelName: "Enrollment", tableName: "Enrollments", timestamps: true }
  );

  return Enrollment;
};