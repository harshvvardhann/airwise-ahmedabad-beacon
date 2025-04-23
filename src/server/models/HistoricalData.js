
'use strict';

module.exports = (sequelize, DataTypes) => {
  const HistoricalData = sequelize.define('HistoricalData', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    avgValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'historical_data',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['locationId', 'pollutantId', 'date'],
        name: 'unique_historical_data',
      },
    ],
  });

  HistoricalData.associate = (models) => {
    HistoricalData.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
    });
    
    HistoricalData.belongsTo(models.Pollutant, {
      foreignKey: 'pollutantId',
      as: 'pollutant',
    });
  };

  return HistoricalData;
};
