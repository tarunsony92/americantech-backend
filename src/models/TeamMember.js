"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TeamMember extends Model {
    static associate(models) {
      // associations added per-model in src/models/TeamMember.js
    }
  }

  TeamMember.init(
    {
      fullName: { type: DataTypes.STRING },
      designation: { type: DataTypes.STRING },
      bio: { type: DataTypes.TEXT },
      avatar: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "TeamMember", tableName: "TeamMembers", timestamps: true }
  );

  return TeamMember;
};
