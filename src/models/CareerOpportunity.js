"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CareerOpportunity extends Model {
    static associate(models) {
            models.CareerOpportunity.belongsTo(models.CareerCategory, { foreignKey: "categoryId", as: "category" });
    }
  }

  CareerOpportunity.init(
    {
      title: { type: DataTypes.STRING },
      categoryId: { type: DataTypes.INTEGER },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "CareerOpportunity", tableName: "CareerOpportunities", timestamps: true }
  );

  return CareerOpportunity;
};
