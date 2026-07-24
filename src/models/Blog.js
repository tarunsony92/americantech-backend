"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
            models.Blog.belongsTo(models.BlogCategory, { foreignKey: "categoryId", as: "category" });
      models.Blog.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
    }
  }

  Blog.init(
    {
      title: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
      categoryId: { type: DataTypes.INTEGER },
      excerpt: { type: DataTypes.TEXT },
      content: { type: DataTypes.TEXT },
      image: { type: DataTypes.STRING },
      authorId: { type: DataTypes.INTEGER },
      isPublished: { type: DataTypes.BOOLEAN },
      publishedAt: { type: DataTypes.DATE },
    },
    { sequelize, modelName: "Blog", tableName: "Blogs", timestamps: true }
  );

  return Blog;
};
