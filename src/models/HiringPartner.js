"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HiringPartner extends Model {
    static associate(models) {
            models.HiringPartner.hasMany(models.Job, { foreignKey: "companyId", as: "jobs" });
    }
  }

  HiringPartner.init(
    {
      name: { type: DataTypes.STRING },
      logo: { type: DataTypes.STRING },
      website: { type: DataTypes.STRING },
      isActive: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "HiringPartner", tableName: "HiringPartners", timestamps: true }
  );

  return HiringPartner;
};
