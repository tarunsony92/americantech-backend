const { Certificate, Student, Course } = require("../models");
const createCrudService = require("./createCrudService");

// Standard admin CRUD — delegated to the generic service.
const certificateService = createCrudService(Certificate, {
  searchableFields: ["certificateNumber"],
  include: [{ model: Course, as: "course" }],
});

// The logged-in student's own certificates — used by the dashboard's My Certificates page.
// Mirrors enrollmentService.listMine: resolves the Student row tied to the authenticated
// user, never trusts a client-supplied studentId.
certificateService.listMine = async (userId) => {
  const student = await Student.findOne({ where: { userId } });
  if (!student) return [];
  return Certificate.findAll({ where: { studentId: student.id }, include: [{ model: Course, as: "course" }] });
};

module.exports = certificateService;
