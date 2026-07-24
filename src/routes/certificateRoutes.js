const { Router } = require("express");
const certificateController = require("../controllers/certificateController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

const router = Router();

// Self-service — must be declared before the generic /:id routes below.
router.get("/mine", authenticate, certificateController.listMine);

// Certificate: contains a student's name and a verifiable certificate number — full list/detail
// reads are admin-only (previously public, which let anyone enumerate every issued certificate).
const adminOnly = [authenticate, authorize("admin")];
router.use(
  "/",
  createCrudRouter(certificateController, {
    list: adminOnly,
    getById: adminOnly,
    create: adminOnly,
    update: adminOnly,
    remove: adminOnly,
  })
);

module.exports = router;
