module.exports = (sequelize, DataTypes) => {
  const Appointment_Vaccinations = sequelize.define(
    "Appointment_Vaccinations",
    {}
  );

  // Appointment_Vaccinations.associate = (models) => {
  //   Appointment_Vaccinations.belongsTo(models.Appointment, {
  //     foreignKey: {
  //       allowNull: false,
  //       name: "appointmentId",
  //     },
  //   });
  //   Appointment_Vaccinations.belongsTo(models.Vaccination, {
  //     foreignKey: {
  //       allowNull: false,
  //       name: "vaccinationId",
  //     },
  //   });
  // };

  return Appointment_Vaccinations;
};
