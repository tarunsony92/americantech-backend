"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
            models.Page.hasOne(models.SEO, { foreignKey: "pageId", as: "seo" });
    }
  }

  Page.init(
    {
      title: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
      content: { type: DataTypes.TEXT },
      isPublished: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "Page", tableName: "Pages", timestamps: true }
  );

  return Page;
};
