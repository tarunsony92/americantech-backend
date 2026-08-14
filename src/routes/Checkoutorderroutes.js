// routes/checkoutOrderRoutes.js
"use strict";

const express = require("express");
const router = express.Router();
const {
  saveCheckoutOrder,
  getCheckoutOrderByPaymentIntent,
  listCheckoutOrders,
} = require("../controllers/Checkoutordercontroller");
// const { protect } = require("../middleware/authMiddleware"); // uncomment if this must be authenticated

// Saves/updates an order for ANY checkout outcome (succeeded / failed / cancelled).
router.post("/", saveCheckoutOrder);

// List orders (optionally filter by ?status= or ?courseId=)
router.get("/", listCheckoutOrders);

// Look up a single order by its Stripe PaymentIntent id
router.get("/:paymentIntentId", getCheckoutOrderByPaymentIntent);

module.exports = router;

/*
Register in your main app file (e.g. app.js / server.js):

const checkoutOrderRoutes = require("./routes/checkoutOrderRoutes");
app.use("/api/checkout-orders", checkoutOrderRoutes);

Also run a migration (or restart with sequelize.sync()) to create the
`checkout_orders` table from the CheckoutOrder model before using this.
*/
