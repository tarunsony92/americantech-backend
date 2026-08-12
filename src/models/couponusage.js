"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CouponUsage extends Model {
    static associate(models) {
      models.CouponUsage.belongsTo(models.Coupon, { foreignKey: "couponId", as: "coupon" });
      if (models.User) {
        models.CouponUsage.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      }
      if (models.Course) {
        models.CouponUsage.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      }
    }
  }

  CouponUsage.init(
    {
      couponId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: true },
      orderAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discountApplied: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { sequelize, modelName: "CouponUsage", tableName: "CouponUsages", timestamps: true }
  );

  return CouponUsage;
};