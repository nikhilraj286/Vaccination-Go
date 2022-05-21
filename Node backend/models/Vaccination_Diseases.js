module.exports = (sequelize, DataTypes) => {
  const Vaccination_Diseases = sequelize.define("Vaccination_Diseases", {});

  // Vaccination_Diseases.associate = (models) => {
  //   Vaccination_Diseases.belongsTo(models.Vaccination, {
  //     foreignKey: {
  //       allowNull: false,
  //       name: "vaccinationId",
  //     },
  //   });
  //   Vaccination_Diseases.belongsTo(models.Disease, {
  //     foreignKey: {
  //       allowNull: false,
  //       name: "diseaseId",
  //     },
  //   });
  // };

  return Vaccination_Diseases;
};
