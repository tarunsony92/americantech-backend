// src/routes/payment.js
const { Router } = require("express");
const router = Router();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env — payment routes will fail.");
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { courseId, amount } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    // NOTE: Using explicit payment_method_types (instead of automatic_payment_methods)
    // forces Stripe.js to ALWAYS include these in the PaymentElement UI, regardless of
    // the customer's detected country/IP. This matches "whatever is enabled in Stripe
    // Dashboard should always be offered on the site" as requested.
    //
    // IMPORTANT LIMITATION (cannot be changed by any code): if a customer selects
    // Klarna or Afterpay/Clearpay while physically located outside their supported
    // countries (US, UK, Canada, Australia, New Zealand), the payment will be
    // declined by Klarna/Afterpay's own servers at confirmation time -- this is a
    // licensing restriction on their end, not a Stripe or website limitation, and
    // cannot be bypassed. Cards and Link have no such restriction and always work.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card", "klarna", "afterpay_clearpay", "link"],
      metadata: { courseId: String(courseId) },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error.message);
    res.status(500).json({ error: error.message || "Payment initialization failed" });
  }
});

module.exports = router;