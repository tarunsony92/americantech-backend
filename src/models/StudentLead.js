"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentLead extends Model {
    static associate(models) {
      // associations added per-model in src/models/StudentLead.js
    }
  }

  StudentLead.init(
    {
      fullName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      courseInterest: { type: DataTypes.STRING },
      source: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "StudentLead", tableName: "StudentLeads", timestamps: true }
  );

  return StudentLead;
};
