
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Measurement = sequelize.define('Measurement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    pollutantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pollutants',
        key: 'id',
      },
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    aqi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    aqiLevel: {
      type: DataTypes.ENUM('good', 'moderate', 'unhealthy', 'bad', 'severe'),
      allowNull: true,
    },
  }, {
    tableName: 'measurements',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['locationId', 'pollutantId', 'timestamp'],
        name: 'unique_measurement',
      },
    ],
  });

  Measurement.associate = (models) => {
    Measurement.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
    });
    
    Measurement.belongsTo(models.Pollutant, {
      foreignKey: 'pollutantId',
      as: 'pollutant',
    });
  };

  return Measurement;
};
