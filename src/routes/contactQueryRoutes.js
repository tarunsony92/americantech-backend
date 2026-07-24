const contactQueryController = require("../controllers/contactQueryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Contact Query: public create (a form submission); reads/writes require permission.
const canRead = [authenticate, requirePermission("contact-queries:read", "contact-queries:write")];
const canWrite = [authenticate, requirePermission("contact-queries:write")];
module.exports = createCrudRouter(contactQueryController, {
  list: canRead,
  getById: canRead,
  create: [],
  update: canWrite,
  remove: canWrite,
});
