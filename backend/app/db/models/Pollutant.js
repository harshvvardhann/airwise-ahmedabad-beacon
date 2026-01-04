'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pollutant = sequelize.define('Pollutant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'pollutants',
    timestamps: true,
  });

  Pollutant.associate = (models) => {
    Pollutant.hasMany(models.Measurement, {
      foreignKey: 'pollutantId',
      as: 'measurements',
    });
  };

  return Pollutant;
};

