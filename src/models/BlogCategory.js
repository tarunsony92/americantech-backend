"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BlogCategory extends Model {
    static associate(models) {
            models.BlogCategory.hasMany(models.Blog, { foreignKey: "categoryId", as: "blogs" });
    }
  }

  BlogCategory.init(
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "BlogCategory", tableName: "BlogCategories", timestamps: true }
  );

  return BlogCategory;
};
