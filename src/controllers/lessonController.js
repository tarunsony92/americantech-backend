const lessonService = require("../services/lessonService");
const createCrudController = require("./createCrudController");

const lessonController = createCrudController(lessonService, "Lesson");

module.exports = lessonController;
