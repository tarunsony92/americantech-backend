"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("coursejobs", "preferredQualifications", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
    await queryInterface.addColumn("coursejobs", "technicalSkills", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
    await queryInterface.addColumn("coursejobs", "softSkills", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
    await queryInterface.addColumn("coursejobs", "careerGrowth", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("coursejobs", "preferredQualifications");
    await queryInterface.removeColumn("coursejobs", "technicalSkills");
    await queryInterface.removeColumn("coursejobs", "softSkills");
    await queryInterface.removeColumn("coursejobs", "careerGrowth");
  },
};