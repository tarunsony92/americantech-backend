"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("coursejobs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      company: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING, defaultValue: "Remote" },
      type: {
        type: Sequelize.ENUM("Full-time", "Part-time", "Contract", "Internship", "Remote"),
        defaultValue: "Full-time",
      },
      experienceLevel: {
        type: Sequelize.ENUM("Entry", "Mid", "Senior", "Lead"),
        defaultValue: "Entry",
      },
      salaryMin: { type: Sequelize.INTEGER },
      salaryMax: { type: Sequelize.INTEGER },
      currency: { type: Sequelize.STRING, defaultValue: "USD" },
      description: { type: Sequelize.TEXT, allowNull: false },
      responsibilities: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] },
      requirements: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] },
      skills: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] },
      category: { type: Sequelize.STRING, allowNull: true },
      applyLink: { type: Sequelize.STRING },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      postedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("coursejobs");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coursejobs_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_coursejobs_experienceLevel";');
  },
};