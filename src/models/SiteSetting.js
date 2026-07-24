"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SiteSetting extends Model {
    static associate(models) {
      // associations added per-model in src/models/SiteSetting.js
    }
  }

  SiteSetting.init(
    {
      key: { type: DataTypes.STRING },
      value: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "SiteSetting", tableName: "SiteSettings", timestamps: true }
  );

  return SiteSetting;
};
