"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    static associate(models) {
      // associations added per-model in src/models/Gallery.js
    }
  }

  Gallery.init(
    {
      title: { type: DataTypes.STRING },
      image: { type: DataTypes.STRING },
      category: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Gallery", tableName: "Gallery", timestamps: true }
  );

  return Gallery;
};
