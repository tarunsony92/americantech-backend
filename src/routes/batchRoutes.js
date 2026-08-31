const batchController = require("../controllers/batchController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Batch: admin-only writes, public reads
const router = createCrudRouter(batchController, [authenticate, authorize("admin")]);

// GET /batches/:id/content — batch ke modules + lessons (public read, same as the rest
// of this router). Registered AFTER the generic router so /:id above still matches
// plain "/batches/:id" first, and this only catches "/:id/content".
router.get("/:id/content", batchController.getContent);

module.exports = router;