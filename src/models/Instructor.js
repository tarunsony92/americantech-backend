"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    static associate(models) {
            models.Instructor.hasMany(models.Course, { foreignKey: "instructorId", as: "courses" });
    }
  }

  Instructor.init(
    {
      fullName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      expertise: { type: DataTypes.STRING },
      bio: { type: DataTypes.TEXT },
      avatar: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Instructor", tableName: "Instructors", timestamps: true }
  );

  return Instructor;
};
