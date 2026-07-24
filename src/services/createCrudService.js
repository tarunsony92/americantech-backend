const { Op } = require("sequelize");

/**
 * Builds a standard CRUD service for a Sequelize model.
 * Controllers call these — they never talk to models directly (Controller -> Service -> Model).
 *
 * @param {import("sequelize").ModelStatic} model
 * @param {object} options
 * @param {string[]} options.searchableFields - columns matched against `search` with ILIKE
 * @param {object[]} options.include - default Sequelize `include` for reads
 */
const createCrudService = (model, { searchableFields = [], include = [] } = {}) => ({
  async list({ page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "DESC", filters = {} } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const where = { ...filters };

    if (search && searchableFields.length) {
      where[Op.or] = searchableFields.map((field) => ({ [field]: { [Op.iLike]: `%${search}%` } }));
    }

    const { rows, count } = await model.findAndCountAll({
      where,
      include,
      limit: Number(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"]],
      distinct: true,
    });

    return {
      items: rows,
      total: count,
      page: Number(page),
      totalPages: Math.max(1, Math.ceil(count / Number(limit))),
    };
  },

  async getById(id) {
    return model.findByPk(id, { include });
  },

  async create(payload) {
    return model.create(payload);
  },

  async update(id, payload) {
    const record = await model.findByPk(id);
    if (!record) return null;
    return record.update(payload);
  },

  async remove(id) {
    const record = await model.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  },
});

module.exports = createCrudService;
