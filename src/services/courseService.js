const { Course, CourseCategory, Instructor, CourseModule, Lesson, Student, Enrollment } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Course — list/get/create/update/remove, all delegated to the generic service.
const courseService = createCrudService(Course, {
  searchableFields: ["title", "level"],
  include: [
    { model: CourseCategory, as: "category", attributes: ["id", "name", "slug"] },
    { model: Instructor, as: "instructor", attributes: ["id", "fullName"] },
  ],
});

// Full course content (modules + lessons, in order), scoped to the requesting student's
// assigned batch — modules now belong to a Batch rather than the Course directly, so we
// resolve which batch this student is enrolled in for this course, then fetch that
// batch's modules. userId is optional (falls back to all of the course's modules when
// not provided, e.g. for admin/instructor preview).
courseService.getContent = async (id, userId) => {
  const course = await Course.findByPk(id, {
    attributes: ["id", "title", "description", "level", "duration"],
  });
  if (!course) return null;

  let batchId = null;

  if (userId) {
    const student = await Student.findOne({ where: { userId } });
    if (student) {
      const enrollment = await Enrollment.findOne({
        where: { studentId: student.id, courseId: id },
      });
      batchId = enrollment?.batchId || null;
    }
  }

  const moduleWhere = batchId ? { batchId } : { courseId: id };

  const modules = await CourseModule.findAll({
    where: moduleWhere,
    attributes: ["id", "title", "order"],
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
  });

  const plainCourse = course.toJSON();
  plainCourse.modules = modules;
  return plainCourse;
};

module.exports = courseService;