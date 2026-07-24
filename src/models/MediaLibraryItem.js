"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MediaLibraryItem extends Model {
    static associate(models) {
      // associations added per-model in src/models/MediaLibraryItem.js
    }
  }

  MediaLibraryItem.init(
    {
      name: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      size: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "MediaLibraryItem", tableName: "MediaLibraryItems", timestamps: true }
  );

  return MediaLibraryItem;
};
