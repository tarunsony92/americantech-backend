"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Coupons", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      discountType: { type: Sequelize.ENUM("percentage", "flat"), allowNull: false },
      discountValue: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      scope: { type: Sequelize.ENUM("all", "specific"), allowNull: false, defaultValue: "all" },
      applicableCourseIds: { type: Sequelize.TEXT, allowNull: true },
      maxDiscountAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      minOrderAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      usageLimit: { type: Sequelize.INTEGER, allowNull: true },
      usedCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      perUserLimit: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 1 },
      startsAt: { type: Sequelize.DATE, allowNull: true },
      expiresAt: { type: Sequelize.DATE, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("CouponUsages", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      couponId: { type: Sequelize.INTEGER, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      courseId: { type: Sequelize.INTEGER, allowNull: true },
      orderAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discountApplied: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("CouponUsages");
    await queryInterface.dropTable("Coupons");
  },
};