const asyncHandler = require("../utils/asyncHandler");
const { success, failure } = require("../utils/apiResponse");

/**
 * Builds standard GET/GET-by-id/POST/PUT/DELETE handlers for a CRUD service.
 * Every resource controller (courses, jobs, blogs, ...) is a thin wrapper around this,
 * optionally overriding a handler for resource-specific logic.
 *
 * @param {ReturnType<import('../services/createCrudService')>} service
 * @param {string} resourceName - used in response messages, e.g. "Course"
 * @param {(req: import('express').Request) => object} [buildFilters] - maps query params to Sequelize `where` filters
 */
const createCrudController = (service, resourceName, buildFilters = () => ({})) => ({
  list: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "", sortBy, sortOrder } = req.query;
    const result = await service.list({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filters: buildFilters(req),
    });
    return success(res, {
      message: `${resourceName} list fetched successfully`,
      data: { items: result.items, total: result.total },
      meta: { page: result.page, totalPages: result.totalPages, limit: Number(limit) },
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const record = await service.getById(req.params.id);
    if (!record) return failure(res, { statusCode: 404, message: `${resourceName} not found` });
    return success(res, { message: `${resourceName} fetched successfully`, data: record });
  }),

  create: asyncHandler(async (req, res) => {
    const record = await service.create(req.body);
    return success(res, { statusCode: 201, message: `${resourceName} created successfully`, data: record });
  }),

  update: asyncHandler(async (req, res) => {
    const record = await service.update(req.params.id, req.body);
    if (!record) return failure(res, { statusCode: 404, message: `${resourceName} not found` });
    return success(res, { message: `${resourceName} updated successfully`, data: record });
  }),

  remove: asyncHandler(async (req, res) => {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return failure(res, { statusCode: 404, message: `${resourceName} not found` });
    return success(res, { message: `${resourceName} deleted successfully` });
  }),
});

module.exports = createCrudController;
