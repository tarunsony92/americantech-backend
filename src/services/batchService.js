const { Batch, Course, CourseModule, Lesson } = require("../models");
const createCrudService = require("./createCrudService");

const batchService = createCrudService(Batch, {
  searchableFields: ["name"],
  include: [{ model: Course, as: "course", attributes: ["id", "title", "level"] }],
});

// Batch ke saath uske modules + lessons (batch-wise curriculum view).
batchService.getContent = async (id) => {
  const batch = await Batch.findByPk(id, {
    attributes: ["id", "name", "courseId", "startDate", "endDate", "status"],
    include: [
      { model: Course, as: "course", attributes: ["id", "title", "level"] },
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
  return batch;
};

module.exports = batchService;