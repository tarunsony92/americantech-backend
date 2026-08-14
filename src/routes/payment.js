// src/routes/payment.js
const { Router } = require("express");
const router = Router();

// Stripe ko lazy-init karo taaki agar key missing ho to clear error mile,
// crash na ho poora server
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env — payment routes will fail.");
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { courseId, amount } = req.body;

    // ---- Validation ----
    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    // ---- Best practice: verify price from DB, don't fully trust client ----
    // const course = await Course.findByPk(courseId);
    // if (!course) return res.status(404).json({ error: "Course not found" });
    // const verifiedAmount = Math.round(course.price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // production mein verifiedAmount use karo
      currency: "usd", // apni currency ke hisaab se badlo
      automatic_payment_methods: {
    enabled: true,
    allow_redirects: "always",   // 👈 YE LINE ADD KARO
  },
      metadata: { courseId: String(courseId) },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error.message);
    res.status(500).json({ error: error.message || "Payment initialization failed" });
  }
});

module.exports = router;