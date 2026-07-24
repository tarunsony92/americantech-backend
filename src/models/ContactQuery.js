"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContactQuery extends Model {
    static associate(models) {
      // associations added per-model in src/models/ContactQuery.js
    }
  }

  ContactQuery.init(
    {
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      subject: { type: DataTypes.STRING },
      message: { type: DataTypes.TEXT },
      isResolved: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "ContactQuery", tableName: "ContactQueries", timestamps: true }
  );

  return ContactQuery;
};
