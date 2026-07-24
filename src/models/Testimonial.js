"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Testimonial extends Model {
    static associate(models) {
      // associations added per-model in src/models/Testimonial.js
    }
  }

  Testimonial.init(
    {
      name: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING },
      quote: { type: DataTypes.TEXT },
      rating: { type: DataTypes.INTEGER },
      avatar: { type: DataTypes.STRING },
      isPublished: { type: DataTypes.BOOLEAN },
    },
    { sequelize, modelName: "Testimonial", tableName: "Testimonials", timestamps: true }
  );

  return Testimonial;
};
