module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("Appointment", {
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    appointmentDateStr: {
      type: DataTypes.STRING,
    },
    appointmentTimeStr: {
      type: DataTypes.STRING,
    },
    appointmentDateTime: {
      type: DataTypes.DATE,
    },
    createdDate: {
      type: DataTypes.DATE,
    },
    isChecked: {
      type: DataTypes.INTEGER,
    },
  });

  Appointment.associate = (models) => {
    // Appointment.hasMany(models.Appointment_Vaccinations, {
    //   onDelete: "cascade",
    //   foreignKey: {
    //     allowNull: false,
    //     name: "appointmentId",
    //   },
    // });
    Appointment.belongsToMany(models.Vaccination, {
      onDelete: "cascade",
      through: models.Appointment_Vaccinations,
      foreignKey: {
        allowNull: false,
        name: "appointmentId",
      },
    });
    Appointment.belongsTo(models.Clinic, {
      foreignKey: {
        allowNull: false,
        name: "clinicId",
      },
    });
    Appointment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        name: "userMrn",
      },
    });
  };

  return Appointment;
};
