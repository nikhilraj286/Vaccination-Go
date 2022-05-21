module.exports = (sequelize, DataTypes) => {
  const Clinic = sequelize.define("Clinic", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    street: {
      type: DataTypes.STRING,
    },
    aptNo: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    zipcode: {
      type: DataTypes.INTEGER,
    },
    startBussinessHour: {
      type: DataTypes.INTEGER,
    },
    endBussinessHour: {
      type: DataTypes.INTEGER,
    },
    noOfPhysician: {
      type: DataTypes.INTEGER,
    },
  });

  Clinic.associate = (models) => {
    Clinic.hasMany(models.Appointment, {
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "clinicId",
      },
    });
  };

  return Clinic;
};
