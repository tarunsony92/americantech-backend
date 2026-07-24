const studentLeadController = require("../controllers/studentLeadController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Student Lead: public create (a form submission), reads are admin-only —
// leads carry the submitter's contact PII and must not be publicly listable.
const adminOnly = [authenticate, authorize("admin")];
module.exports = createCrudRouter(studentLeadController, {
  list: adminOnly,
  getById: adminOnly,
  create: [],
  update: adminOnly,
  remove: adminOnly,
});
