"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
            models.City.belongsTo(models.State, { foreignKey: "stateId", as: "state" });
      models.City.hasMany(models.Student, { foreignKey: "cityId", as: "students" });
    }
  }

  City.init(
    {
      name: { type: DataTypes.STRING },
      stateId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "City", tableName: "Cities", timestamps: true }
  );

  return City;
};
