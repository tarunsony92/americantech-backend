"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate(models) {
      // associations added per-model in src/models/Video.js
    }
  }

  Video.init(
    {
      title: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      thumbnail: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Video", tableName: "Videos", timestamps: true }
  );

  return Video;
};
