const enrollmentService = require("../services/enrollmentService");
const createCrudController = require("./createCrudController");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const enrollmentController = createCrudController(enrollmentService, "Enrollment");

// Self-service enroll — the logged-in user enrolls themselves; studentId is never trusted from the client.
enrollmentController.enrollSelf = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollSelf(req.user.id, req.body.courseId);
  return success(res, { statusCode: 201, message: "Enrolled successfully", data: enrollment });
});

// The logged-in student's own enrollments — used by the dashboard's My Courses page.
enrollmentController.listMine = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.listMine(req.user.id);
  return success(res, { message: "Your enrollments", data: { items: enrollments, total: enrollments.length } });
});

module.exports = enrollmentController;
