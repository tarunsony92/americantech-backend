const { Router } = require("express");
const { ActivityLog, User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const { authenticate, authorize } = require("../middlewares/auth");

const router = Router();
const adminOnly = [authenticate, authorize("admin")];

// Read-only by design: audit logs must be immutable, so there is intentionally no
// create/update/delete here, unlike every other resource in resourceMap.json.
router.get(
  "/",
  ...adminOnly,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await ActivityLog.findAndCountAll({
      include: [
        { model: User, as: "user", attributes: ["id", "fullName", "email"] },
        { model: User, as: "actor", attributes: ["id", "fullName", "email"] },
      ],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });
    return success(res, {
      message: "Audit logs fetched successfully",
      data: { items: rows, total: count },
      meta: { page: Number(page), totalPages: Math.max(1, Math.ceil(count / Number(limit))) },
    });
  })
);

module.exports = router;
