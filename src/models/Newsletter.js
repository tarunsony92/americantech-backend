"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Newsletter extends Model {
    static associate(models) {
      // associations added per-model in src/models/Newsletter.js
    }
  }

  Newsletter.init(
    {
      email: { type: DataTypes.STRING },
      isActive: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "Newsletter", tableName: "Newsletters", timestamps: true }
  );

  return Newsletter;
};
