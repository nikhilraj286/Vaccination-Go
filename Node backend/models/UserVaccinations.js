module.exports = (sequelize, DataTypes) => {
  const UserVaccinations = sequelize.define("UserVaccinations", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    dosesLeft: {
      type: DataTypes.INTEGER,
    },
    nextAppointmentTime: {
      type: DataTypes.STRING,
    },
  });

  UserVaccinations.associate = (models) => {
    UserVaccinations.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
    });
    UserVaccinations.belongsTo(models.Vaccination, {
      foreignKey: {
        allowNull: false,
        name: "vaccinationId",
      },
    });
  };

  return UserVaccinations;
};
