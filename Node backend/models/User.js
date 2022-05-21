module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    mrn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
    admin: {
      type: DataTypes.BOOLEAN,
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
  });

  User.associate = (models) => {
    User.hasMany(models.Appointment, {
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "userMrn",
      },
    });
    User.hasMany(models.UserVaccinations, {
      onDelete: "cascade",
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
    });
  };

  return User;
};
