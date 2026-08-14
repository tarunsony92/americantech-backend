"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("checkout_orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      // ---- Course / order context ----
      courseId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      coursePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      // ---- Coupon ----
      couponCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discountAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },

      // ---- Amounts ----
      finalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      amountPaid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "inr",
      },

      // ---- Billing snapshot ----
      firstName: { type: Sequelize.STRING, allowNull: true },
      lastName: { type: Sequelize.STRING, allowNull: true },
      company: { type: Sequelize.STRING, allowNull: true },
      country: { type: Sequelize.STRING, allowNull: true },
      address1: { type: Sequelize.STRING, allowNull: true },
      address2: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      state: { type: Sequelize.STRING, allowNull: true },
      zip: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },

      // ---- Payment / Stripe tracking ----
      paymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM("succeeded", "failed", "cancelled", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      failureReason: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Helpful for the ?status= filter in listCheckoutOrders
    await queryInterface.addIndex("checkout_orders", ["status"]);
    await queryInterface.addIndex("checkout_orders", ["courseId"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("checkout_orders");
    // MySQL keeps the ENUM type attached to the column, dropping the table
    // is sufficient — no separate ENUM cleanup needed (unlike Postgres).
  },
};