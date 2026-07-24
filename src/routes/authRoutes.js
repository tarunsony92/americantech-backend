const { Router } = require("express");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const { authLimiter } = require("../middlewares/rateLimiter");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require("../validators/authValidator");

const router = Router();

router.post("/register", authLimiter, registerValidator, validateRequest, authController.register);
router.post("/login", authLimiter, loginValidator, validateRequest, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authenticate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validateRequest, authController.forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidator, validateRequest, authController.resetPassword);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/change-password", authenticate, changePasswordValidator, validateRequest, authController.changePassword);

module.exports = router;
