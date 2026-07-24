"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // associations added per-model in src/models/Event.js
    }
  }

  Event.init(
    {
      title: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      date: { type: DataTypes.DATE },
      location: { type: DataTypes.STRING },
      image: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Event", tableName: "Events", timestamps: true }
  );

  return Event;
};
