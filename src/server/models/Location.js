
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'locations',
    timestamps: true,
  });

  Location.associate = (models) => {
    Location.belongsTo(models.City, { 
      foreignKey: 'cityId',
      as: 'city',
    });
    
    Location.hasMany(models.Measurement, {
      foreignKey: 'locationId',
      as: 'measurements',
    });
  };

  return Location;
};
