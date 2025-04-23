
'use strict';

const { sequelize } = require('../../models');

async function migrateTables() {
  try {
    // Sync all models with force: false to avoid dropping tables in production
    await sequelize.sync({ force: false });
    console.log('Database tables synchronized successfully!');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
}

async function seed() {
  const { City, Pollutant } = require('../../models');
  
  // Seed cities
  try {
    await City.findOrCreate({
      where: { name: 'Ahmedabad' },
      defaults: { name: 'Ahmedabad', country: 'India' }
    });
    console.log('Cities seeded successfully');
  } catch (error) {
    console.error('Error seeding cities:', error);
  }
  
  // Seed pollutants
  try {
    const pollutants = [
      { name: 'pm25', fullName: 'Fine Particulate Matter', description: 'Particles with a diameter of 2.5 micrometers or less', unit: 'μg/m³' },
      { name: 'pm10', fullName: 'Particulate Matter', description: 'Particles with a diameter of 10 micrometers or less', unit: 'μg/m³' },
      { name: 'no2', fullName: 'Nitrogen Dioxide', description: 'Toxic gas produced by combustion processes', unit: 'ppb' },
      { name: 'so2', fullName: 'Sulfur Dioxide', description: 'Toxic gas with a strong odor', unit: 'ppb' },
      { name: 'co', fullName: 'Carbon Monoxide', description: 'Colorless, odorless toxic gas', unit: 'ppm' },
      { name: 'o3', fullName: 'Ozone', description: 'Reactive gas composed of three oxygen atoms', unit: 'ppb' }
    ];
    
    for (const p of pollutants) {
      await Pollutant.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
    }
    
    console.log('Pollutants seeded successfully');
  } catch (error) {
    console.error('Error seeding pollutants:', error);
  }
}

async function init() {
  try {
    await migrateTables();
    await seed();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  init();
}

module.exports = { init, migrateTables, seed };
