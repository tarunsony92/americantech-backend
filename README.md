# American Tech Global — Backend

Node.js + Express + PostgreSQL (Sequelize) API. Controller → Service → Model layering throughout;
no business logic lives in controllers.

## Stack
Express, PostgreSQL, Sequelize ORM, JWT auth, Bcrypt, Multer, Nodemailer, express-validator.

## Setup

```bash
npm install
cp .env.example .env      # then edit DB credentials, JWT secrets, SMTP if you want email to send
createdb american_tech_global   # or use your preferred Postgres client
npm run db:migrate
npm run db:seed
npm run dev                # http://localhost:5000/api/v1
```

Seeded data: `admin` / `instructor` / `student` roles, 5 job application statuses, and one admin
login — `admin@americantechglobal.com` / `Admin@12345` (change this immediately in any real deployment).

## Project layout

```
src/
  config/           sequelize CLI config + db connection
  database/
    migrations/      one per table (43 tables)
    seeders/          roles, application statuses, admin user
  models/            Sequelize models + associations (src/models/index.js auto-loads them)
  services/           business logic — the only layer that touches models
  controllers/         thin HTTP layer — calls services, formats responses
  routes/              REST routes, mostly built from createCrudRouter
  middlewares/         auth (JWT + RBAC), file upload, validation, error handling
  validators/          express-validator chains
  helpers/              JWT signing/verification
  utils/                asyncHandler, standard API response shape
```

## How the generic CRUD layer works

Every simple resource (courses, blogs, jobs, testimonials, FAQs, ...) is wired the same way:

```
services/<x>Service.js     = createCrudService(Model, { searchableFields })
controllers/<x>Controller.js = createCrudController(service, "Label")
routes/<x>Routes.js         = createCrudRouter(controller, guards)
```

`createCrudService` gives every resource list (with pagination/search/sort/filter), getById,
create, update, remove — see `src/services/createCrudService.js`. This is what "Do NOT write
business logic inside controllers. Controller → Service → Model" means in practice here: swap the
model and you have a fully working, paginated, searchable REST resource in three tiny files.

Resources needing custom behavior (JWT-based auth, multipart resume uploads on job applications)
have hand-written services/controllers/routes instead of the generated ones — see
`src/services/authService.js` and `src/routes/jobApplicationRoutes.js`.

`scripts/generate-tables.js` and `scripts/generate-crud-resources.js` are the one-off codegen
scripts used to scaffold the 43 tables and their CRUD layers — safe to re-run if you add a new
table to the TABLES / RESOURCES maps in each script (they overwrite generated files, not
hand-written ones).

## API conventions

- Base path: `/api/v1`
- List endpoints: `GET /<resource>?page=1&limit=10&search=&sortBy=createdAt&sortOrder=DESC`
- Response shape: `{ success, message, data, meta? }` on success, `{ success: false, message, errors? }` on failure
- Auth: `Authorization: Bearer <accessToken>`; refresh via `POST /auth/refresh-token`
- Admin-only writes are enforced with `authenticate` + `authorize("admin")` — public-facing forms
  (job applications, contact queries, newsletter signup, student leads) allow public `POST` but still
  require admin auth to update/delete.

## Tested

All 43 migrations run clean against Postgres 16. Verified end-to-end: admin login, RBAC rejection
on non-admin writes, course category/course creation, public course listing with pagination,
student registration + duplicate-email rejection, express-validator error responses, public contact
query submission, and job application submission with an actual multipart PDF resume upload landing
in `src/uploads/resumes/`.
