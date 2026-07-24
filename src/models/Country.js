"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
            models.Country.hasMany(models.State, { foreignKey: "countryId", as: "states" });
    }
  }

  Country.init(
    {
      name: { type: DataTypes.STRING },
      code: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Country", tableName: "Countries", timestamps: true }
  );

  return Country;
};
