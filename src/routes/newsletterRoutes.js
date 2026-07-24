const newsletterController = require("../controllers/newsletterController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Newsletter Subscriber: public create (a form submission); reads/writes require permission.
const canRead = [authenticate, requirePermission("newsletters:read", "newsletters:write")];
const canWrite = [authenticate, requirePermission("newsletters:write")];
module.exports = createCrudRouter(newsletterController, {
  list: canRead,
  getById: canRead,
  create: [],
  update: canWrite,
  remove: canWrite,
});
