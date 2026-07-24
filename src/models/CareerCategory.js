"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CareerCategory extends Model {
    static associate(models) {
            models.CareerCategory.hasMany(models.Job, { foreignKey: "categoryId", as: "jobs" });
      models.CareerCategory.hasMany(models.CareerOpportunity, { foreignKey: "categoryId", as: "opportunities" });
    }
  }

  CareerCategory.init(
    {
      name: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "CareerCategory", tableName: "CareerCategories", timestamps: true }
  );

  return CareerCategory;
};
