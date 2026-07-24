"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {
            models.State.belongsTo(models.Country, { foreignKey: "countryId", as: "country" });
      models.State.hasMany(models.City, { foreignKey: "stateId", as: "cities" });
    }
  }

  State.init(
    {
      name: { type: DataTypes.STRING },
      countryId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "State", tableName: "States", timestamps: true }
  );

  return State;
};
