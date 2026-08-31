const courseController = require("../controllers/courseController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Course: public reads, writes require the courses:write permission (granted to admin and
// instructor roles — see database/seeders/20260101000104-seed-role-permissions.js).
const canWrite = [authenticate, requirePermission("courses:write")];
const router = createCrudRouter(courseController, canWrite);

// GET /courses/:id/content — batch-specific modules + lessons for a course. Needs
// authenticate (not public anymore) so req.user.id is available to resolve which batch
// the requesting student is enrolled in. Registered AFTER the generic router so /:id
// above still matches plain "/courses/:id" first for exact id lookups, and this only
// catches the more specific "/:id/content" path.
router.get("/:id/content", authenticate, courseController.getContent);

module.exports = router;