
'use strict';

module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'cities',
    timestamps: true,
  });

  City.associate = (models) => {
    City.hasMany(models.Location, { 
      foreignKey: 'cityId',
      as: 'locations',
    });
  };

  return City;
};
