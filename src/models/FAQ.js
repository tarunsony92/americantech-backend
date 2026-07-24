"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    static associate(models) {
      // associations added per-model in src/models/FAQ.js
    }
  }

  FAQ.init(
    {
      question: { type: DataTypes.STRING },
      answer: { type: DataTypes.TEXT },
      category: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "FAQ", tableName: "FAQs", timestamps: true }
  );

  return FAQ;
};
