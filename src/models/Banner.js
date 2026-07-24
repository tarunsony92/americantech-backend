"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    static associate(models) {
      // associations added per-model in src/models/Banner.js
    }
  }

  Banner.init(
    {
      title: { type: DataTypes.STRING },
      subtitle: { type: DataTypes.STRING },
      image: { type: DataTypes.STRING },
      ctaLabel: { type: DataTypes.STRING },
      ctaLink: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
      isActive: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "Banner", tableName: "Banners", timestamps: true }
  );

  return Banner;
};
