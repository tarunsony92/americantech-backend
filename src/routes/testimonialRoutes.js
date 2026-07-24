const testimonialController = require("../controllers/testimonialController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Testimonial: admin-only writes, public reads
module.exports = createCrudRouter(testimonialController, [authenticate, authorize("admin")]);
