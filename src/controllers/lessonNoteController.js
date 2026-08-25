const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");
const lessonNoteService = require("../services/lessonNoteService");

const lessonNoteController = {
  list: asyncHandler(async (req, res) => {
    const notes = await lessonNoteService.list({ lessonId: req.query.lessonId });
    return success(res, { message: "Lesson notes fetched successfully", data: notes });
  }),

  create: asyncHandler(async (req, res) => {
    if (!req.file) {
      return failure(res, { statusCode: 400, message: "No file uploaded" });
    }

    const note = await lessonNoteService.create({
      lessonId: req.body.lessonId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return success(res, { statusCode: 201, message: "Note uploaded successfully", data: note });
  }),

  remove: asyncHandler(async (req, res) => {
    const deleted = await lessonNoteService.remove(req.params.id);
    if (!deleted) return failure(res, { statusCode: 404, message: "Note not found" });
    return success(res, { message: "Note deleted successfully" });
  }),
};

module.exports = lessonNoteController;