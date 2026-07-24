const { Enrollment, Student, Course, sequelize } = require("../models");
const createCrudService = require("./createCrudService");

// Standard admin CRUD (list/get/update/remove) — delegated to the generic service.
const enrollmentService = createCrudService(Enrollment, {
  searchableFields: [],
  include: [{ model: Course, as: "course" }],
});

// Self-service enroll: resolves (or creates) the logged-in user's Student profile and
// enrolls them in the given course. This is what the "Enroll Now" button calls — a student
// enrolls themselves, they never get to pass an arbitrary studentId from the client.
//
// Wrapped in a transaction, and duplicate enrollment is ultimately enforced by a unique DB
// constraint on (studentId, courseId) — not just the pre-check below. Two near-simultaneous
// clicks of "Enroll Now" can both pass the pre-check before either commits; the DB constraint
// is what actually prevents a duplicate row in that case, and we translate that failure into
// the same friendly 409 the pre-check gives.
enrollmentService.enrollSelf = async (userId, courseId) => {
  try {
    return await sequelize.transaction(async (t) => {
      const course = await Course.findByPk(courseId, { transaction: t });
      if (!course) {
        const err = new Error("Course not found");
        err.statusCode = 404;
        throw err;
      }

      let student = await Student.findOne({ where: { userId }, transaction: t });
      if (!student) {
        student = await Student.create({ userId, enrollmentCount: 0 }, { transaction: t });
      }

      const existing = await Enrollment.findOne({
        where: { studentId: student.id, courseId },
        transaction: t,
      });
      if (existing) {
        const err = new Error("You're already enrolled in this course");
        err.statusCode = 409;
        throw err;
      }

      const enrollment = await Enrollment.create(
        { studentId: student.id, courseId, progress: 0, status: "active", enrolledAt: new Date() },
        { transaction: t }
      );

      await student.increment("enrollmentCount", { transaction: t });
      return enrollment;
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const dupErr = new Error("You're already enrolled in this course");
      dupErr.statusCode = 409;
      throw dupErr;
    }
    throw err;
  }
};

// Used by the student dashboard's "My Courses" — enrollments for the logged-in student only.
enrollmentService.listMine = async (userId) => {
  const student = await Student.findOne({ where: { userId } });
  if (!student) return [];
  return Enrollment.findAll({ where: { studentId: student.id }, include: [{ model: Course, as: "course" }] });
};

module.exports = enrollmentService;
