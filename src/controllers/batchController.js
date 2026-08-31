const batchService = require("../services/batchService");
const createCrudController = require("./createCrudController");
const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");

const buildFilters = (req) => {
  const filters = {};
  if (req.query.courseId) filters.courseId = req.query.courseId;
  if (req.query.status) filters.status = req.query.status;
  return filters;
};

const batchController = createCrudController(batchService, "Batch", buildFilters);

// GET /batches/:id/content — batch ke modules + lessons.
batchController.getContent = asyncHandler(async (req, res) => {
  const batch = await batchService.getContent(req.params.id);
  if (!batch) return failure(res, { statusCode: 404, message: "Batch not found" });
  return success(res, { message: "Batch content fetched successfully", data: batch });
});

module.exports = batchController;