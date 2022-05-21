module.exports = (sequelize, DataTypes) => {
  const Vaccination = sequelize.define("Vaccination", {
    vaccinationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
    },
    vaccinationName: {
      type: DataTypes.STRING,
      unique: true,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    numberOfShots: {
      type: DataTypes.INTEGER,
    },
    shotInternalVal: {
      type: DataTypes.INTEGER,
    },
  });

  Vaccination.associate = (models) => {
    // Vaccination.hasMany(models.Appointment_Vaccinations, {
    //   onDelete: "cascade",
    //   foreignKey: {
    //     allowNull: false,
    //     name: "vaccinationId",
    //   },
    // });
    Vaccination.belongsToMany(models.Appointment, {
      onDelete: "cascade",
      through: models.Appointment_Vaccinations,
      foreignKey: {
        allowNull: false,
        name: "vaccinationId",
      },
    });
    // Vaccination.hasMany(models.Vaccination_Diseases, {
    //   onDelete: "cascade",
    //   foreignKey: {
    //     allowNull: false,
    //     name: "vaccinationId",
    //   },
    // });
    Vaccination.belongsToMany(models.Disease, {
      onDelete: "cascade",
      through: models.Vaccination_Diseases,
      foreignKey: {
        allowNull: false,
        name: "vaccinationId",
      },
    });
    Vaccination.hasMany(models.UserVaccinations, {
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "vaccinationId",
      },
    });
  };

  return Vaccination;
};
