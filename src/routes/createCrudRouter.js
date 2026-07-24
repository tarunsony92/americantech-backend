const { Router } = require("express");

/**
 * Builds a standard REST router: GET / , GET /:id , POST / , PUT /:id , DELETE /:id
 * Supports ?page, ?limit, ?search, ?sortBy, ?sortOrder on the list route.
 *
 * @param {ReturnType<import('../controllers/createCrudController')>} controller
 * @param {import('express').RequestHandler[] | {list?: import('express').RequestHandler[], getById?: import('express').RequestHandler[], create?: import('express').RequestHandler[], update?: import('express').RequestHandler[], remove?: import('express').RequestHandler[]}} [guards]
 *   Either one guard array applied to create/update/delete (list/getById stay PUBLIC — use this
 *   only for genuinely public-read resources like courses/blogs), or a per-operation object.
 *   The per-operation object additionally accepts `list` and `getById` guards for resources whose
 *   reads must NOT be public (e.g. students, enrollments, job applications, leads — anything with PII).
 * @param {object} [validators] - { create: [...], update: [...] } express-validator chains
 */
const createCrudRouter = (controller, guards = [], validators = {}) => {
  const router = Router();
  const isPerOperation = !Array.isArray(guards);
  const listGuards = isPerOperation ? guards.list || [] : [];
  const getByIdGuards = isPerOperation ? guards.getById || [] : [];
  const createGuards = isPerOperation ? guards.create || [] : guards;
  const updateGuards = isPerOperation ? guards.update || [] : guards;
  const removeGuards = isPerOperation ? guards.remove || [] : guards;

  router.get("/", ...listGuards, controller.list);
  router.get("/:id", ...getByIdGuards, controller.getById);
  router.post("/", ...createGuards, ...(validators.create || []), controller.create);
  router.put("/:id", ...updateGuards, ...(validators.update || []), controller.update);
  router.delete("/:id", ...removeGuards, controller.remove);

  return router;
};

module.exports = createCrudRouter;

