const { Course, CourseCategory, Instructor, CourseModule, Lesson } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Course — list/get/create/update/remove, all delegated to the generic service.
const courseService = createCrudService(Course, {
  searchableFields: ["title", "level"],
  include: [
    { model: CourseCategory, as: "category", attributes: ["id", "name", "slug"] },
    { model: Instructor, as: "instructor", attributes: ["id", "fullName"] },
  ],
});

// Full course content (modules + lessons, in order) — used by the "learn" page once a
// student is on a specific course. Kept separate from the default include above so the
// course list/detail views don't drag the entire curriculum along every time.
courseService.getContent = async (id) => {
  const course = await Course.findByPk(id, {
    attributes: ["id", "title", "description", "level", "duration"],
    include: [
      {
        model: CourseModule,
        as: "modules",
        attributes: ["id", "title", "order"],
        separate: true,
        order: [["order", "ASC"]],
        include: [
          {
            model: Lesson,
            as: "lessons",
            attributes: ["id", "title", "content", "videoUrl", "order"],
            separate: true,
            order: [["order", "ASC"]],
          },
        ],
      },
    ],
  });

  return course;
};

module.exports = courseService;