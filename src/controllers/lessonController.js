const lessonService = require("../services/lessonService");
const createCrudController = require("./createCrudController");

const buildFilters = (req) => {
  const filters = {};
  if (req.query.moduleId) filters.moduleId = req.query.moduleId;
  return filters;
};

const lessonController = createCrudController(lessonService, "Lesson", buildFilters);

module.exports = lessonController;