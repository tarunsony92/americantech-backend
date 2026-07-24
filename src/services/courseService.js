const { Course, CourseCategory, Instructor } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Course — list/get/create/update/remove, all delegated to the generic service.
const courseService = createCrudService(Course, {
  searchableFields: ["title","level"],
  include: [
    { model: CourseCategory, as: "category", attributes: ["id", "name", "slug"] },
    { model: Instructor, as: "instructor", attributes: ["id", "fullName"] },
  ],
});

module.exports = courseService;
