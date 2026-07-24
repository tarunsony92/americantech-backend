const { Router } = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

const router = Router();
const canRead = [authenticate, requirePermission("users:read", "users:write")];
const canWrite = [authenticate, requirePermission("users:write")];

router.get("/", ...canRead, userController.list);
router.get("/:id", ...canRead, userController.getById);
router.post("/", ...canWrite, userController.create);
router.put("/:id", ...canWrite, userController.update);
router.delete("/:id", ...canWrite, userController.remove);

router.post("/:id/enable", ...canWrite, userController.enable);
router.post("/:id/disable", ...canWrite, userController.disable);
router.post("/:id/reset-password", ...canWrite, userController.resetPassword);
router.post("/:id/assign-role", ...canWrite, userController.assignRole);

router.get("/:id/login-history", ...canRead, userController.loginHistory);
router.get("/:id/activity-history", ...canRead, userController.activityHistory);

module.exports = router;
