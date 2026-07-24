const courseService = require("../services/courseService");
const createCrudController = require("./createCrudController");

const courseController = createCrudController(courseService, "Course");

module.exports = courseController;
