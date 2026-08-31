const courseService = require("../services/courseService");
const createCrudController = require("./createCrudController");
const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");

const courseController = createCrudController(courseService, "Course");

// GET /courses/:id/content — batch-specific modules + lessons for the requesting student.
courseController.getContent = asyncHandler(async (req, res) => {
  const course = await courseService.getContent(req.params.id, req.user?.id);
  if (!course) return failure(res, { statusCode: 404, message: "Course not found" });
  return success(res, { message: "Course content fetched successfully", data: course });
});

module.exports = courseController;