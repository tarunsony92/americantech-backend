const courseModuleService = require("../services/courseModuleService");
const createCrudController = require("./createCrudController");

const buildFilters = (req) => {
  const filters = {};
  if (req.query.courseId) filters.courseId = req.query.courseId;
  return filters;
};

const courseModuleController = createCrudController(
  courseModuleService,
  "Course Module",
  buildFilters
);

module.exports = courseModuleController;