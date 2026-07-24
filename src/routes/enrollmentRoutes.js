const { Router } = require("express");
const enrollmentController = require("../controllers/enrollmentController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

const router = Router();

// Any authenticated user (student) can enroll themselves and see their own enrollments.
// These must be declared before the generic /:id routes below so "mine" isn't parsed as an id.
router.post("/enroll", authenticate, enrollmentController.enrollSelf);
router.get("/mine", authenticate, enrollmentController.listMine);

// Admin CRUD for everything else (viewing/managing all enrollments). Reads are admin-only too —
// enrollment records tie students to courses and must not be publicly listable.
const adminOnly = [authenticate, authorize("admin")];
router.use(
  "/",
  createCrudRouter(enrollmentController, {
    list: adminOnly,
    getById: adminOnly,
    create: adminOnly,
    update: adminOnly,
    remove: adminOnly,
  })
);

module.exports = router;
