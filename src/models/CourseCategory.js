"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CourseCategory extends Model {
    static associate(models) {
            models.CourseCategory.hasMany(models.Course, { foreignKey: "categoryId", as: "courses" });
    }
  }

  CourseCategory.init(
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "CourseCategory", tableName: "CourseCategories", timestamps: true }
  );

  return CourseCategory;
};
