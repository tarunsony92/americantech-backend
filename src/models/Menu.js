"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
            models.Menu.hasMany(models.MenuItem, { foreignKey: "menuId", as: "items" });
    }
  }

  Menu.init(
    {
      name: { type: DataTypes.STRING },
      location: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Menu", tableName: "Menus", timestamps: true }
  );

  return Menu;
};
