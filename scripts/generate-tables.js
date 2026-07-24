/**
 * One-off codegen script. Run with: node scripts/generate-tables.js
 * Generates a migration + a model file for every table defined in TABLES below.
 * Associations are added by hand afterwards in each model's associate() stub.
 */
const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = path.join(__dirname, "../src/database/migrations");
const MODELS_DIR = path.join(__dirname, "../src/models");

// type: sequelize DataTypes expression (as string, used in both migration + model)
// Each table gets id (INTEGER PK autoincrement), the fields below, then timestamps.
const TABLES = {
  Role: { table: "Roles", fields: { name: "STRING", description: "TEXT" } },
  Permission: { table: "Permissions", fields: { name: "STRING", description: "TEXT" } },
  RolePermission: { table: "RolePermissions", fields: { roleId: "INTEGER", permissionId: "INTEGER" } },
  User: {
    table: "Users",
    fields: {
      fullName: "STRING", email: "STRING", password: "STRING", phone: "STRING",
      roleId: "INTEGER", avatar: "STRING", isActive: "BOOLEAN", isEmailVerified: "BOOLEAN",
      passwordResetToken: "STRING", passwordResetExpires: "DATE",
    },
  },
  CourseCategory: { table: "CourseCategories", fields: { name: "STRING", slug: "STRING", description: "TEXT" } },
  Course: {
    table: "Courses",
    fields: {
      title: "STRING", slug: "STRING", categoryId: "INTEGER", description: "TEXT",
      duration: "STRING", level: "STRING", price: "DECIMAL", rating: "DECIMAL",
      image: "STRING", isPublished: "BOOLEAN", instructorId: "INTEGER",
    },
  },
  CourseModule: { table: "CourseModules", fields: { courseId: "INTEGER", title: "STRING", order: "INTEGER" } },
  Lesson: { table: "Lessons", fields: { moduleId: "INTEGER", title: "STRING", content: "TEXT", videoUrl: "STRING", order: "INTEGER" } },
  BlogCategory: { table: "BlogCategories", fields: { name: "STRING", slug: "STRING" } },
  Blog: {
    table: "Blogs",
    fields: {
      title: "STRING", slug: "STRING", categoryId: "INTEGER", excerpt: "TEXT", content: "TEXT",
      image: "STRING", authorId: "INTEGER", isPublished: "BOOLEAN", publishedAt: "DATE",
    },
  },
  Testimonial: { table: "Testimonials", fields: { name: "STRING", role: "STRING", quote: "TEXT", rating: "INTEGER", avatar: "STRING", isPublished: "BOOLEAN" } },
  SuccessStory: { table: "SuccessStories", fields: { name: "STRING", title: "STRING", summary: "TEXT", image: "STRING", studentId: "INTEGER", isPublished: "BOOLEAN" } },
  HiringPartner: { table: "HiringPartners", fields: { name: "STRING", logo: "STRING", website: "STRING", isActive: "BOOLEAN" } },
  Job: {
    table: "Jobs",
    fields: {
      title: "STRING", companyId: "INTEGER", location: "STRING", type: "STRING",
      description: "TEXT", requirements: "TEXT", categoryId: "INTEGER", isActive: "BOOLEAN",
    },
  },
  JobApplication: {
    table: "JobApplications",
    fields: {
      jobId: "INTEGER", fullName: "STRING", email: "STRING", phone: "STRING",
      resume: "STRING", coverLetter: "TEXT", statusId: "INTEGER", userId: "INTEGER",
    },
  },
  Instructor: { table: "Instructors", fields: { fullName: "STRING", email: "STRING", expertise: "STRING", bio: "TEXT", avatar: "STRING" } },
  StudentLead: { table: "StudentLeads", fields: { fullName: "STRING", email: "STRING", phone: "STRING", courseInterest: "STRING", source: "STRING", status: "STRING" } },
  Student: { table: "Students", fields: { userId: "INTEGER", enrollmentCount: "INTEGER", cityId: "INTEGER" } },
  Enrollment: { table: "Enrollments", fields: { studentId: "INTEGER", courseId: "INTEGER", progress: "INTEGER", status: "STRING", enrolledAt: "DATE" } },
  Certificate: { table: "Certificates", fields: { studentId: "INTEGER", courseId: "INTEGER", certificateNumber: "STRING", issuedAt: "DATE", fileUrl: "STRING" } },
  FAQ: { table: "FAQs", fields: { question: "STRING", answer: "TEXT", category: "STRING", order: "INTEGER" } },
  ContactQuery: { table: "ContactQueries", fields: { name: "STRING", email: "STRING", phone: "STRING", subject: "STRING", message: "TEXT", isResolved: "BOOLEAN" } },
  Newsletter: { table: "Newsletters", fields: { email: "STRING", isActive: "BOOLEAN" } },
  Event: { table: "Events", fields: { title: "STRING", description: "TEXT", date: "DATE", location: "STRING", image: "STRING" } },
  Page: { table: "Pages", fields: { title: "STRING", slug: "STRING", content: "TEXT", isPublished: "BOOLEAN" } },
  SiteSetting: { table: "SiteSettings", fields: { key: "STRING", value: "TEXT" } },
  Banner: { table: "Banners", fields: { title: "STRING", subtitle: "STRING", image: "STRING", ctaLabel: "STRING", ctaLink: "STRING", order: "INTEGER", isActive: "BOOLEAN" } },
  Gallery: { table: "Gallery", fields: { title: "STRING", image: "STRING", category: "STRING" } },
  Video: { table: "Videos", fields: { title: "STRING", url: "STRING", thumbnail: "STRING" } },
  Download: { table: "Downloads", fields: { title: "STRING", fileUrl: "STRING", category: "STRING" } },
  SocialLink: { table: "SocialLinks", fields: { platform: "STRING", url: "STRING", icon: "STRING" } },
  Menu: { table: "Menus", fields: { name: "STRING", location: "STRING" } },
  MenuItem: { table: "MenuItems", fields: { menuId: "INTEGER", label: "STRING", url: "STRING", order: "INTEGER", parentId: "INTEGER" } },
  SEO: { table: "SEOs", fields: { pageId: "INTEGER", metaTitle: "STRING", metaDescription: "TEXT", ogImage: "STRING" } },
  MediaLibraryItem: { table: "MediaLibraryItems", fields: { name: "STRING", url: "STRING", type: "STRING", size: "INTEGER" } },
  Review: { table: "Reviews", fields: { courseId: "INTEGER", studentId: "INTEGER", rating: "INTEGER", comment: "TEXT" } },
  TeamMember: { table: "TeamMembers", fields: { fullName: "STRING", designation: "STRING", bio: "TEXT", avatar: "STRING" } },
  CareerCategory: { table: "CareerCategories", fields: { name: "STRING", slug: "STRING" } },
  CareerOpportunity: { table: "CareerOpportunities", fields: { title: "STRING", categoryId: "INTEGER", description: "TEXT" } },
  ApplicationStatus: { table: "ApplicationStatuses", fields: { name: "STRING" } },
  Country: { table: "Countries", fields: { name: "STRING", code: "STRING" } },
  State: { table: "States", fields: { name: "STRING", countryId: "INTEGER" } },
  City: { table: "Cities", fields: { name: "STRING", stateId: "INTEGER" } },
};

const typeMap = {
  STRING: "DataTypes.STRING", TEXT: "DataTypes.TEXT", INTEGER: "DataTypes.INTEGER",
  BOOLEAN: "DataTypes.BOOLEAN", DATE: "DataTypes.DATE", DECIMAL: "DataTypes.DECIMAL(10, 2)",
};
const migTypeMap = {
  STRING: "Sequelize.STRING", TEXT: "Sequelize.TEXT", INTEGER: "Sequelize.INTEGER",
  BOOLEAN: "Sequelize.BOOLEAN", DATE: "Sequelize.DATE", DECIMAL: "Sequelize.DECIMAL(10, 2)",
};

let ts = 20260101000000;
const pad = (n) => String(n);

Object.entries(TABLES).forEach(([modelName, def], i) => {
  const stamp = pad(ts + i);
  const migFields = Object.entries(def.fields)
    .map(([f, t]) => `      ${f}: { type: ${migTypeMap[t]}, allowNull: ${["fullName", "email", "title", "name", "question"].includes(f) ? "false" : "true"} },`)
    .join("\n");

  const migration = `"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("${def.table}", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
${migFields}
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("${def.table}");
  },
};
`;
  fs.writeFileSync(path.join(MIGRATIONS_DIR, `${stamp}-create-${def.table.toLowerCase()}.js`), migration);

  const modelFields = Object.entries(def.fields)
    .map(([f, t]) => `      ${f}: { type: ${typeMap[t]} },`)
    .join("\n");

  const model = `"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ${modelName} extends Model {
    static associate(models) {
      // associations added per-model in src/models/${modelName}.js
    }
  }

  ${modelName}.init(
    {
${modelFields}
    },
    { sequelize, modelName: "${modelName}", tableName: "${def.table}", timestamps: true }
  );

  return ${modelName};
};
`;
  fs.writeFileSync(path.join(MODELS_DIR, `${modelName}.js`), model);
});

console.log(`Generated ${Object.keys(TABLES).length} migrations + models.`);
