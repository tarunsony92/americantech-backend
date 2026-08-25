const { Router } = require("express");
const lessonNoteController = require("../controllers/lessonNoteController");
const { authenticate, authorize } = require("../middlewares/auth");
const { uploadNotes } = require("../middlewares/upload");

const router = Router();

// Reads — public (students viewing lesson notes)
router.get("/", lessonNoteController.list);

// Writes — admin only
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadNotes.single("file"),
  lessonNoteController.create
);

router.delete("/:id", authenticate, authorize("admin"), lessonNoteController.remove);

module.exports = router;