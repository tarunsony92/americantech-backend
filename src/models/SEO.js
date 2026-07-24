"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SEO extends Model {
    static associate(models) {
            models.SEO.belongsTo(models.Page, { foreignKey: "pageId", as: "page" });
    }
  }

  SEO.init(
    {
      pageId: { type: DataTypes.INTEGER },
      metaTitle: { type: DataTypes.STRING },
      metaDescription: { type: DataTypes.TEXT },
      ogImage: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "SEO", tableName: "SEOs", timestamps: true }
  );

  return SEO;
};
