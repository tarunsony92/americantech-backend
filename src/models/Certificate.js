"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
            models.Certificate.belongsTo(models.Student, { foreignKey: "studentId", as: "student" });
      models.Certificate.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
    }
  }

  Certificate.init(
    {
      studentId: { type: DataTypes.INTEGER },
      courseId: { type: DataTypes.INTEGER },
      certificateNumber: { type: DataTypes.STRING },
      issuedAt: { type: DataTypes.DATE },
      fileUrl: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Certificate", tableName: "Certificates", timestamps: true }
  );

  return Certificate;
};
