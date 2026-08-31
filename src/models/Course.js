"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      models.Course.belongsTo(models.CourseCategory, { foreignKey: "categoryId", as: "category" });
      models.Course.belongsTo(models.Instructor, { foreignKey: "instructorId", as: "instructor" });
      models.Course.hasMany(models.CourseModule, { foreignKey: "courseId", as: "modules" });
      models.Course.hasMany(models.Enrollment, { foreignKey: "courseId", as: "enrollments" });
      models.Course.hasMany(models.Review, { foreignKey: "courseId", as: "reviews" });
      models.Course.hasMany(models.Certificate, { foreignKey: "courseId", as: "certificates" });
      models.Course.hasMany(models.Batch, { foreignKey: "courseId", as: "batches" });
    }
  }

  Course.init(
    {
      title: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
      categoryId: { type: DataTypes.INTEGER },
      description: { type: DataTypes.TEXT },
      duration: { type: DataTypes.STRING },
      level: { type: DataTypes.STRING },
      price: { type: DataTypes.DECIMAL(10, 2) },
      rating: { type: DataTypes.DECIMAL(10, 2) },
      image: { type: DataTypes.STRING },
      isPublished: { type: DataTypes.BOOLEAN },
      instructorId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "Course", tableName: "Courses", timestamps: true }
  );

  return Course;
};