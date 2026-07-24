"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
            models.MenuItem.belongsTo(models.Menu, { foreignKey: "menuId", as: "menu" });
      models.MenuItem.belongsTo(models.MenuItem, { foreignKey: "parentId", as: "parent" });
      models.MenuItem.hasMany(models.MenuItem, { foreignKey: "parentId", as: "children" });
    }
  }

  MenuItem.init(
    {
      menuId: { type: DataTypes.INTEGER },
      label: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER },
      parentId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "MenuItem", tableName: "MenuItems", timestamps: true }
  );

  return MenuItem;
};
