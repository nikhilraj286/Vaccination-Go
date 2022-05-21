module.exports = (sequelize, DataTypes) => {
  const Disease = sequelize.define("Disease", {
    diseaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    diseaseDesc: {
      type: DataTypes.STRING,
    },
    diseaseName: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Disease.associate = (models) => {
    // Disease.hasMany(models.Vaccination_Diseases, {
    //   onDelete: "cascade",
    //   foreignKey: {
    //     allowNull: false,
    //     name: "diseaseId",
    //   },
    // });
    Disease.belongsToMany(models.Vaccination, {
      onDelete: "cascade",
      through: models.Vaccination_Diseases,
      foreignKey: {
        allowNull: false,
        name: "diseaseId",
      },
    });
  };

  return Disease;
};
