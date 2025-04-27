
'use strict';

module.exports = (sequelize, DataTypes) => {
  const AirQualityPrediction = sequelize.define('AirQualityPrediction', {
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
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    predictionData: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('predictionData');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('predictionData', JSON.stringify(value));
      }
    },
  }, {
    tableName: 'air_quality_predictions',
    timestamps: true,
  });

  AirQualityPrediction.associate = (models) => {
    AirQualityPrediction.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
    });
  };

  return AirQualityPrediction;
};
