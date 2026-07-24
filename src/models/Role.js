"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
            models.Role.hasMany(models.User, { foreignKey: "roleId", as: "users" });
      models.Role.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: "roleId", otherKey: "permissionId", as: "permissions" });
    }
  }

  Role.init(
    {
      name: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "Role", tableName: "Roles", timestamps: true }
  );

  return Role;
};
