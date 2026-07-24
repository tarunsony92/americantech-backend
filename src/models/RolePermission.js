"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
            models.RolePermission.belongsTo(models.Role, { foreignKey: "roleId" });
      models.RolePermission.belongsTo(models.Permission, { foreignKey: "permissionId" });
    }
  }

  RolePermission.init(
    {
      roleId: { type: DataTypes.INTEGER },
      permissionId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "RolePermission", tableName: "RolePermissions", timestamps: true }
  );

  return RolePermission;
};
