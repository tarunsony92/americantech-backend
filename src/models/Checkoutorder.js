// models/Checkoutorder.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const CheckoutOrder = sequelize.define(
    "CheckoutOrder",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // ---- Course / order context ----
      courseId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courseTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coursePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      // ---- Coupon ----
      couponCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },

      // ---- Amounts ----
      finalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // null until/unless payment actually succeeds
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "inr",
      },

      // ---- Billing snapshot (kept even if payment fails/cancels) ----
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      company: DataTypes.STRING,
      country: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zip: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      notes: DataTypes.TEXT,

      // ---- Payment / Stripe tracking ----
      paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true, // one order row per PaymentIntent attempt
      },
      // succeeded | failed | cancelled | pending
      status: {
        type: DataTypes.ENUM("succeeded", "failed", "cancelled", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      failureReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Optional: link to logged-in user if this checkout is authenticated
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "checkout_orders",
      timestamps: true, // createdAt / updatedAt
    }
  );

  CheckoutOrder.associate = function (models) {
    // Example, uncomment/adjust if you have a User model and want the link:
    // CheckoutOrder.belongsTo(models.User, { foreignKey: "userId" });
  };

  return CheckoutOrder;
};