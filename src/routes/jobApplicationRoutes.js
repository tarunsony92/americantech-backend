const jobApplicationController = require("../controllers/jobApplicationController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");
const { uploadResume } = require("../middlewares/upload");

// Job Application: public create via multipart form (resume upload); reads/writes require permission.
const mapResumeToBody = (req, res, next) => {
  if (req.file) {
    req.body.resume = `/uploads/resumes/${req.file.filename}`;
  }
  next();
};

const canRead = [authenticate, requirePermission("job-applications:read", "job-applications:write")];
const canWrite = [authenticate, requirePermission("job-applications:write")];
module.exports = createCrudRouter(jobApplicationController, {
  list: canRead,
  getById: canRead,
  create: [uploadResume.single("resume"), mapResumeToBody],
  update: canWrite,
  remove: canWrite,
});
