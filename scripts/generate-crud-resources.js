/**
 * One-off codegen script. Run with: node scripts/generate-crud-resources.js
 * Generates a thin service, controller and route file per resource, all built on the
 * generic factories (createCrudService / createCrudController / createCrudRouter).
 * Resource-specific logic (file uploads, custom filters, public vs admin-only writes)
 * is expressed in RESOURCES below rather than hand-written per file.
 */
const fs = require("fs");
const path = require("path");

const SERVICES_DIR = path.join(__dirname, "../src/services");
const CONTROLLERS_DIR = path.join(__dirname, "../src/controllers");
const ROUTES_DIR = path.join(__dirname, "../src/routes");

// modelName, resourcePath (kebab-case, matches the frontend's createResourceService calls),
// searchable fields, and access rules for the write routes.
const RESOURCES = [
  { model: "CourseCategory", path: "course-categories", label: "Course Category", searchable: ["name"] },
  { model: "Course", path: "courses", label: "Course", searchable: ["title", "level"] },
  { model: "CourseModule", path: "course-modules", label: "Course Module", searchable: ["title"] },
  { model: "Lesson", path: "lessons", label: "Lesson", searchable: ["title"] },
  { model: "BlogCategory", path: "blog-categories", label: "Blog Category", searchable: ["name"] },
  { model: "Blog", path: "blogs", label: "Blog", searchable: ["title"] },
  { model: "Testimonial", path: "testimonials", label: "Testimonial", searchable: ["name"] },
  { model: "SuccessStory", path: "success-stories", label: "Success Story", searchable: ["name", "title"] },
  { model: "HiringPartner", path: "hiring-partners", label: "Hiring Partner", searchable: ["name"] },
  { model: "Job", path: "jobs", label: "Job", searchable: ["title", "location", "type"] },
  { model: "JobApplication", path: "job-applications", label: "Job Application", searchable: ["fullName", "email"], publicCreate: true },
  { model: "Instructor", path: "instructors", label: "Instructor", searchable: ["fullName", "expertise"] },
  { model: "StudentLead", path: "student-leads", label: "Student Lead", searchable: ["fullName", "email"], publicCreate: true },
  { model: "Student", path: "students", label: "Student", searchable: [] },
  { model: "Enrollment", path: "enrollments", label: "Enrollment", searchable: [] },
  { model: "Certificate", path: "certificates", label: "Certificate", searchable: ["certificateNumber"] },
  { model: "FAQ", path: "faqs", label: "FAQ", searchable: ["question"] },
  { model: "ContactQuery", path: "contact-queries", label: "Contact Query", searchable: ["name", "email", "subject"], publicCreate: true },
  { model: "Newsletter", path: "newsletters", label: "Newsletter Subscriber", searchable: ["email"], publicCreate: true },
  { model: "Event", path: "events", label: "Event", searchable: ["title", "location"] },
  { model: "Page", path: "pages", label: "Page", searchable: ["title", "slug"] },
  { model: "SiteSetting", path: "site-settings", label: "Site Setting", searchable: ["key"] },
  { model: "Banner", path: "banners", label: "Banner", searchable: ["title"] },
  { model: "Gallery", path: "gallery", label: "Gallery Image", searchable: ["title", "category"] },
  { model: "Video", path: "videos", label: "Video", searchable: ["title"] },
  { model: "Download", path: "downloads", label: "Download", searchable: ["title"] },
  { model: "SocialLink", path: "social-links", label: "Social Link", searchable: ["platform"] },
  { model: "Menu", path: "menus", label: "Menu", searchable: ["name"] },
  { model: "MenuItem", path: "menu-items", label: "Menu Item", searchable: ["label"] },
  { model: "SEO", path: "seo", label: "SEO Entry", searchable: ["metaTitle"] },
  { model: "MediaLibraryItem", path: "media-library", label: "Media Item", searchable: ["name"] },
  { model: "Review", path: "reviews", label: "Review", searchable: ["comment"] },
  { model: "TeamMember", path: "team-members", label: "Team Member", searchable: ["fullName", "designation"] },
  { model: "CareerCategory", path: "career-categories", label: "Career Category", searchable: ["name"] },
  { model: "CareerOpportunity", path: "career-opportunities", label: "Career Opportunity", searchable: ["title"] },
  { model: "ApplicationStatus", path: "application-statuses", label: "Application Status", searchable: ["name"] },
  { model: "Country", path: "countries", label: "Country", searchable: ["name"] },
  { model: "State", path: "states", label: "State", searchable: ["name"] },
  { model: "City", path: "cities", label: "City", searchable: ["name"] },
  { model: "Role", path: "roles", label: "Role", searchable: ["name"] },
  { model: "Permission", path: "permissions", label: "Permission", searchable: ["name"] },
];

const HAND_WRITTEN_ROUTES = ["JobApplication", "Enrollment"];
const HAND_WRITTEN_SERVICES = ["Course", "Job", "Blog", "Enrollment"];
const HAND_WRITTEN_CONTROLLERS = ["Enrollment"];

RESOURCES.forEach(({ model, path: resourcePath, label, searchable, publicCreate }) => {
  const serviceVar = `${model.charAt(0).toLowerCase()}${model.slice(1)}Service`;

  const serviceContent = `const { ${model} } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for ${label} — list/get/create/update/remove, all delegated to the generic service.
const ${serviceVar} = createCrudService(${model}, {
  searchableFields: ${JSON.stringify(searchable)},
});

module.exports = ${serviceVar};
`;
  if (!HAND_WRITTEN_SERVICES.includes(model)) {
    fs.writeFileSync(path.join(SERVICES_DIR, `${serviceVar}.js`), serviceContent);
  }

  const controllerVar = `${model.charAt(0).toLowerCase()}${model.slice(1)}Controller`;
  const controllerContent = `const ${serviceVar} = require("../services/${serviceVar}");
const createCrudController = require("./createCrudController");

const ${controllerVar} = createCrudController(${serviceVar}, "${label}");

module.exports = ${controllerVar};
`;
  if (!HAND_WRITTEN_CONTROLLERS.includes(model)) {
    fs.writeFileSync(path.join(CONTROLLERS_DIR, `${controllerVar}.js`), controllerContent);
  }

  const guardExpr = publicCreate
    ? `{ create: [], update: [authenticate, authorize("admin")], remove: [authenticate, authorize("admin")] }`
    : `[authenticate, authorize("admin")]`;

  const routeContent = `const ${controllerVar} = require("../controllers/${controllerVar}");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// ${label}: ${publicCreate ? "public create (e.g. a form submission), admin-only update/delete" : "admin-only writes, public reads"}
module.exports = createCrudRouter(${controllerVar}, ${guardExpr});
`;
  if (!HAND_WRITTEN_ROUTES.includes(model)) {
    fs.writeFileSync(path.join(ROUTES_DIR, `${serviceVar.replace("Service", "")}Routes.js`), routeContent);
  }
});

console.log(`Generated ${RESOURCES.length} service + controller + route files.`);

// Emit the resource -> path map so routes/index.js can mount everything without hand-editing.
fs.writeFileSync(
  path.join(ROUTES_DIR, "resourceMap.json"),
  JSON.stringify(
    RESOURCES.map((r) => ({ path: r.path, file: `${r.model.charAt(0).toLowerCase()}${r.model.slice(1)}Routes` })),
    null,
    2
  )
);
