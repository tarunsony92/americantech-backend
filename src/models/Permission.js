"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
            models.Permission.belongsToMany(models.Role, { through: models.RolePermission, foreignKey: "permissionId", otherKey: "roleId", as: "roles" });
    }
  }

  Permission.init(
    {
      name: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "Permission", tableName: "Permissions", timestamps: true }
  );

  return Permission;
};
