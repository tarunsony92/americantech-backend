const { Router } = require("express");
const router = Router();
const db = require("../models"); // aapke project ka models index
const { Coupon, CouponUsage } = db;

// ---------------- ADMIN: CRUD ----------------

router.get("/admin/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/admin/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/admin/coupons", async (req, res) => {
  try {
    const {
      code, discountType, discountValue, scope, applicableCourseIds,
      maxDiscountAmount, minOrderAmount, usageLimit, perUserLimit,
      startsAt, expiresAt, isActive,
    } = req.body;

    if (!code || !discountType || discountValue == null) {
      return res.status(400).json({ success: false, message: "code, discountType and discountValue are required" });
    }
    if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({ success: false, message: "Percentage discount must be between 1 and 100" });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      scope: scope || "all",
      applicableCourseIds: scope === "specific" ? applicableCourseIds : null,
      maxDiscountAmount: maxDiscountAmount || null,
      minOrderAmount: minOrderAmount || 0,
      usageLimit: usageLimit || null,
      perUserLimit: perUserLimit || 1,
      startsAt: startsAt || null,
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Coupon code already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/admin/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    const payload = { ...req.body };
    if (payload.code) payload.code = payload.code.trim().toUpperCase();
    if (payload.scope !== "specific") payload.applicableCourseIds = null;

    await coupon.update(payload);
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/admin/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    await coupon.destroy();
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------------- USER: Validate coupon at checkout ----------------

router.post("/coupons/validate", async (req, res) => {
  try {
    const { code, courseId, orderAmount } = req.body;
    const userId = req.user?.id; // apne authMiddleware ke req.user structure ke hisaab se adjust karo

    if (!code || !courseId || orderAmount == null) {
      return res.status(400).json({ success: false, message: "code, courseId and orderAmount are required" });
    }

    const coupon = await Coupon.findOne({ where: { code: code.trim().toUpperCase() } });
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code" });
    }

    const now = new Date();
    if (coupon.startsAt && now < new Date(coupon.startsAt)) {
      return res.status(400).json({ success: false, message: "This coupon is not active yet" });
    }
    if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    }

    if (coupon.scope === "specific") {
      const allowedIds = (coupon.applicableCourseIds || "").split(",").map((id) => id.trim());
      if (!allowedIds.includes(String(courseId))) {
        return res.status(400).json({ success: false, message: "This coupon is not valid for this course" });
      }
    }

    if (coupon.minOrderAmount && Number(orderAmount) < Number(coupon.minOrderAmount)) {
      return res.status(400).json({ success: false, message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}` });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "This coupon has reached its usage limit" });
    }

    if (coupon.perUserLimit && userId) {
      const userUsageCount = await CouponUsage.count({ where: { couponId: coupon.id, userId } });
      if (userUsageCount >= coupon.perUserLimit) {
        return res.status(400).json({ success: false, message: "You have already used this coupon" });
      }
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (Number(orderAmount) * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscountAmount) discount = Math.min(discount, Number(coupon.maxDiscountAmount));
    } else {
      discount = Number(coupon.discountValue);
    }
    discount = Math.min(discount, Number(orderAmount));
    const finalAmount = Number(orderAmount) - discount;

    res.json({
      success: true,
      data: {
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Number(discount.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;