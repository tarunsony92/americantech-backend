"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
            models.Student.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      models.Student.belongsTo(models.City, { foreignKey: "cityId", as: "city" });
      models.Student.hasMany(models.Enrollment, { foreignKey: "studentId", as: "enrollments" });
      models.Student.hasMany(models.Certificate, { foreignKey: "studentId", as: "certificates" });
    }
  }

  Student.init(
    {
      userId: { type: DataTypes.INTEGER },
      enrollmentCount: { type: DataTypes.INTEGER },
      cityId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "Student", tableName: "Students", timestamps: true }
  );

  return Student;
};
