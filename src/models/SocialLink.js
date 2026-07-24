"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SocialLink extends Model {
    static associate(models) {
      // associations added per-model in src/models/SocialLink.js
    }
  }

  SocialLink.init(
    {
      platform: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      icon: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "SocialLink", tableName: "SocialLinks", timestamps: true }
  );

  return SocialLink;
};
