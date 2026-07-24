"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Download extends Model {
    static associate(models) {
      // associations added per-model in src/models/Download.js
    }
  }

  Download.init(
    {
      title: { type: DataTypes.STRING },
      fileUrl: { type: DataTypes.STRING },
      category: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Download", tableName: "Downloads", timestamps: true }
  );

  return Download;
};
