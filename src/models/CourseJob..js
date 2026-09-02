module.exports = (sequelize, DataTypes) => {
  const CourseJob = sequelize.define(
    "CourseJob",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      company: { type: DataTypes.STRING, allowNull: false },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: { type: DataTypes.STRING, defaultValue: "Remote" },
      type: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Internship", "Remote"),
        defaultValue: "Full-time",
      },
      experienceLevel: {
        type: DataTypes.ENUM("Entry", "Mid", "Senior", "Lead"),
        defaultValue: "Entry",
      },
      salaryMin: DataTypes.STRING,
      salaryMax: DataTypes.STRING,
      course: DataTypes.STRING,
      currency: { type: DataTypes.STRING, defaultValue: "USD" },
      description: { type: DataTypes.TEXT, allowNull: false },
      responsibilities: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      requirements: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      skills: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },

      // ---- New fields ----
      preferredQualifications: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      technicalSkills: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      softSkills: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
      careerGrowth: { type: DataTypes.TEXT, allowNull: true },
      // ---------------------

      category: { type: DataTypes.STRING, allowNull: true },
      applyLink: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      postedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "coursejobs", timestamps: true }
  );

  return CourseJob;
};