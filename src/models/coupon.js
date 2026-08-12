"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      models.Coupon.hasMany(models.CouponUsage, { foreignKey: "couponId", as: "usages" });
    }
  }

  Coupon.init(
    {
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      discountType: { type: DataTypes.ENUM("percentage", "flat"), allowNull: false },
      discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      scope: { type: DataTypes.ENUM("all", "specific"), allowNull: false, defaultValue: "all" },
      applicableCourseIds: { type: DataTypes.TEXT, allowNull: true }, // comma separated ids
      maxDiscountAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      minOrderAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      usageLimit: { type: DataTypes.INTEGER, allowNull: true },
      usedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      perUserLimit: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      startsAt: { type: DataTypes.DATE, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, modelName: "Coupon", tableName: "Coupons", timestamps: true }
  );

  return Coupon;
};