// controllers/checkoutOrderController.js
"use strict";

const crypto = require("crypto");
const { CheckoutOrder } = require("../models"); // pulled from models/index.js barrel

// Builds the plain-object payload shared by create/update paths.
const buildOrderPayload = (body) => {
  const {
    courseId,
    courseTitle,
    coursePrice,
    couponCode,
    discountAmount,
    finalAmount,
    amountPaid,
    currency,
    billing = {},
    paymentIntentId,
    status,
    failureReason,
    userId,
  } = body;

  return {
    courseId,
    courseTitle,
    coursePrice,
    couponCode: couponCode || null,
    discountAmount: discountAmount || 0,
    finalAmount,
    amountPaid: amountPaid ?? null,
    currency: currency || "inr",

    firstName: billing.firstName || null,
    lastName: billing.lastName || null,
    company: billing.company || null,
    country: billing.country || null,
    address1: billing.address1 || null,
    address2: billing.address2 || null,
    city: billing.city || null,
    state: billing.state || null,
    zip: billing.zip || null,
    phone: billing.phone || null,
    email: billing.email || null,
    notes: billing.notes || null,

    paymentIntentId: paymentIntentId || null,
    status: status || "pending",
    failureReason: failureReason || null,
    userId: userId || null,
  };
};

// POST /api/checkout-orders
// Called for EVERY checkout outcome — success, failure, and cancellation.
// - If a paymentIntentId is present, we upsert on it so retries (e.g. a
//   failed attempt followed by a successful one) update the same row
//   instead of creating duplicates.
// - If there's no paymentIntentId (e.g. user cancelled before Stripe ever
//   returned one), we generate a local reference so the attempt is still
//   recorded.
exports.saveCheckoutOrder = async (req, res) => {
  try {
    const payload = buildOrderPayload(req.body);

    if (!payload.courseId || payload.finalAmount === undefined || payload.finalAmount === null) {
      return res.status(400).json({
        success: false,
        message: "courseId and finalAmount are required.",
      });
    }

    // No paymentIntentId (e.g. user backed out before Stripe ever returned
    // one) — still record the attempt under a generated local reference.
    if (!payload.paymentIntentId) {
      payload.paymentIntentId = `local_${crypto.randomUUID()}`;
      if (!payload.status || payload.status === "pending") {
        payload.status = "cancelled";
      }
    }

    const [order, created] = await CheckoutOrder.findOrCreate({
      where: { paymentIntentId: payload.paymentIntentId },
      defaults: payload,
    });

    if (!created) {
      await order.update(payload);
    }

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Order recorded." : "Order updated.",
      data: order,
    });
  } catch (err) {
    console.error("saveCheckoutOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Could not save checkout order.",
      error: err.message, // TEMP: helps debugging, remove/guard in production
    });
  }
};

// GET /api/checkout-orders/:paymentIntentId
exports.getCheckoutOrderByPaymentIntent = async (req, res) => {
  try {
    const order = await CheckoutOrder.findOne({
      where: { paymentIntentId: req.params.paymentIntentId },
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    return res.json({ success: true, data: order });
  } catch (err) {
    console.error("getCheckoutOrderByPaymentIntent error:", err);
    return res.status(500).json({ success: false, message: "Could not fetch order." });
  }
};

// GET /api/checkout-orders  (optional: list/filter, e.g. ?status=failed)
exports.listCheckoutOrders = async (req, res) => {
  try {
    const { status, courseId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (courseId) where.courseId = courseId;

    const orders = await CheckoutOrder.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error("listCheckoutOrders error:", err);
    return res.status(500).json({ success: false, message: "Could not fetch orders." });
  }
};