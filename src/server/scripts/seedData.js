
const { sequelize, City, Location, Pollutant, Measurement, HistoricalData } = require('../models');
const { calculateAQI, getAQILevel } = require('../utils/aqiCalculator');

// Sample cities data
const CITIES_DATA = [
  { name: 'Ahmedabad', country: 'India' },
  { name: 'Mumbai', country: 'India' },
  { name: 'Delhi', country: 'India' },
  { name: 'Bengaluru', country: 'India' },
  { name: 'Chennai', country: 'India' },
  { name: 'Kolkata', country: 'India' },
  { name: 'Pune', country: 'India' },
  { name: 'Hyderabad', country: 'India' }
];

// Sample locations for each city
const LOCATIONS_DATA = {
  'Ahmedabad': [
    { name: 'Ellis Bridge', latitude: 23.0225, longitude: 72.5714 },
    { name: 'Paldi', latitude: 23.0157, longitude: 72.5659 },
    { name: 'Narol', latitude: 22.9676, longitude: 72.6176 },
    { name: 'Maninagar', latitude: 22.9976, longitude: 72.6009 },
    { name: 'Satellite', latitude: 23.0393, longitude: 72.5240 }
  ],
  'Mumbai': [
    { name: 'Bandra Kurla Complex', latitude: 19.0649, longitude: 72.8681 },
    { name: 'Andheri', latitude: 19.1136, longitude: 72.8697 },
    { name: 'Worli', latitude: 19.0176, longitude: 72.8191 },
    { name: 'Powai', latitude: 19.1197, longitude: 72.9073 }
  ],
  'Delhi': [
    { name: 'Connaught Place', latitude: 28.6304, longitude: 77.2177 },
    { name: 'Karol Bagh', latitude: 28.6519, longitude: 77.1909 },
    { name: 'Dwarka', latitude: 28.5921, longitude: 77.0460 },
    { name: 'Rohini', latitude: 28.7041, longitude: 77.1025 }
  ],
  'Bengaluru': [
    { name: 'Electronic City', latitude: 12.8456, longitude: 77.6603 },
    { name: 'Whitefield', latitude: 12.9698, longitude: 77.7500 },
    { name: 'Koramangala', latitude: 12.9352, longitude: 77.6245 },
    { name: 'Indiranagar', latitude: 12.9719, longitude: 77.6412 }
  ],
  'Chennai': [
    { name: 'T. Nagar', latitude: 13.0418, longitude: 80.2341 },
    { name: 'Anna Nagar', latitude: 13.0850, longitude: 80.2101 },
    { name: 'Velachery', latitude: 12.9815, longitude: 80.2203 },
    { name: 'OMR', latitude: 12.8406, longitude: 80.2070 }
  ],
  'Kolkata': [
    { name: 'Park Street', latitude: 22.5548, longitude: 88.3639 },
    { name: 'Salt Lake', latitude: 22.5958, longitude: 88.4497 },
    { name: 'Howrah', latitude: 22.5958, longitude: 88.2636 },
    { name: 'New Town', latitude: 22.6203, longitude: 88.4370 }
  ],
  'Pune': [
    { name: 'Shivajinagar', latitude: 18.5308, longitude: 73.8475 },
    { name: 'Hinjewadi', latitude: 18.5912, longitude: 73.7389 },
    { name: 'Kothrud', latitude: 18.5074, longitude: 73.8077 },
    { name: 'Viman Nagar', latitude: 18.5679, longitude: 73.9143 }
  ],
  'Hyderabad': [
    { name: 'Hitech City', latitude: 17.4435, longitude: 78.3772 },
    { name: 'Secunderabad', latitude: 17.5040, longitude: 78.5030 },
    { name: 'Gachibowli', latitude: 17.4399, longitude: 78.3488 },
    { name: 'Banjara Hills', latitude: 17.4126, longitude: 78.4482 }
  ]
};

// Pollutants data
const POLLUTANTS_DATA = [
  { 
    name: 'pm25', 
    fullName: 'Fine Particulate Matter', 
    description: 'Particles with a diameter of 2.5 micrometers or less', 
    unit: 'μg/m³' 
  },
  { 
    name: 'pm10', 
    fullName: 'Particulate Matter', 
    description: 'Particles with a diameter of 10 micrometers or less', 
    unit: 'μg/m³' 
  },
  { 
    name: 'no2', 
    fullName: 'Nitrogen Dioxide', 
    description: 'Toxic gas produced by combustion processes', 
    unit: 'ppb' 
  },
  { 
    name: 'so2', 
    fullName: 'Sulfur Dioxide', 
    description: 'Toxic gas with a strong odor', 
    unit: 'ppb' 
  },
  { 
    name: 'co', 
    fullName: 'Carbon Monoxide', 
    description: 'Colorless, odorless toxic gas', 
    unit: 'ppm' 
  },
  { 
    name: 'o3', 
    fullName: 'Ozone', 
    description: 'Reactive gas composed of three oxygen atoms', 
    unit: 'ppb' 
  }
];

// Generate realistic pollutant values based on Indian city conditions
function generateRealisticValue(pollutantName, cityName, timeOfDay = 'day') {
  const cityFactors = {
    'Delhi': 1.8, // High pollution
    'Mumbai': 1.5,
    'Ahmedabad': 1.4,
    'Kolkata': 1.6,
    'Chennai': 1.2,
    'Bengaluru': 1.1,
    'Pune': 1.0,
    'Hyderabad': 1.1
  };
  
  const cityFactor = cityFactors[cityName] || 1.0;
  const timeFactor = timeOfDay === 'night' ? 0.8 : 1.0; // Lower at night
  
  const baseValues = {
    'pm25': { min: 15, max: 150, variance: 0.3 },
    'pm10': { min: 30, max: 250, variance: 0.3 },
    'no2': { min: 10, max: 80, variance: 0.4 },
    'so2': { min: 5, max: 40, variance: 0.5 },
    'co': { min: 0.5, max: 8, variance: 0.4 },
    'o3': { min: 20, max: 120, variance: 0.4 }
  };
  
  const pollutant = baseValues[pollutantName];
  if (!pollutant) return Math.random() * 50;
  
  const range = pollutant.max - pollutant.min;
  const baseValue = pollutant.min + (Math.random() * range);
  const variance = 1 + (Math.random() - 0.5) * pollutant.variance;
  
  return Math.round((baseValue * cityFactor * timeFactor * variance) * 100) / 100;
}

// Seed cities
async function seedCities() {
  console.log('Seeding cities...');
  
  for (const cityData of CITIES_DATA) {
    await City.findOrCreate({
      where: { name: cityData.name },
      defaults: cityData
    });
  }
  
  console.log(`✓ Seeded ${CITIES_DATA.length} cities`);
}

// Seed locations
async function seedLocations() {
  console.log('Seeding locations...');
  
  let totalLocations = 0;
  
  for (const [cityName, locations] of Object.entries(LOCATIONS_DATA)) {
    const city = await City.findOne({ where: { name: cityName } });
    if (!city) {
      console.warn(`City not found: ${cityName}`);
      continue;
    }
    
    for (const locationData of locations) {
      await Location.findOrCreate({
        where: { 
          cityId: city.id, 
          name: locationData.name 
        },
        defaults: {
          ...locationData,
          cityId: city.id
        }
      });
      totalLocations++;
    }
  }
  
  console.log(`✓ Seeded ${totalLocations} locations`);
}

// Seed pollutants
async function seedPollutants() {
  console.log('Seeding pollutants...');
  
  for (const pollutantData of POLLUTANTS_DATA) {
    await Pollutant.findOrCreate({
      where: { name: pollutantData.name },
      defaults: pollutantData
    });
  }
  
  console.log(`✓ Seeded ${POLLUTANTS_DATA.length} pollutants`);
}

// Generate sample measurements for the last N days
async function generateSampleMeasurements(days = 30) {
  console.log(`Generating sample measurements for last ${days} days...`);
  
  const locations = await Location.findAll({ include: ['city'] });
  const pollutants = await Pollutant.findAll();
  
  let totalMeasurements = 0;
  
  for (let dayOffset = days; dayOffset >= 0; dayOffset--) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    
    // Generate measurements every 4 hours (6 per day)
    for (let hour = 0; hour < 24; hour += 4) {
      const measurementTime = new Date(date);
      measurementTime.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      
      for (const location of locations) {
        for (const pollutant of pollutants) {
          try {
            const value = generateRealisticValue(
              pollutant.name, 
              location.city.name,
              hour >= 20 || hour <= 6 ? 'night' : 'day'
            );
            
            const aqi = calculateAQI(value, pollutant.name);
            const aqiLevel = getAQILevel(aqi);
            
            const [measurement, created] = await Measurement.findOrCreate({
              where: {
                locationId: location.id,
                pollutantId: pollutant.id,
                timestamp: measurementTime
              },
              defaults: {
                locationId: location.id,
                pollutantId: pollutant.id,
                value,
                unit: pollutant.unit,
                timestamp: measurementTime,
                source: 'sample_data',
                aqi,
                aqiLevel
              }
            });
            
            if (created) {
              totalMeasurements++;
            }
            
          } catch (error) {
            console.error(`Error creating measurement for ${location.name} - ${pollutant.name}:`, error.message);
          }
        }
      }
    }
    
    // Progress indicator
    if (dayOffset % 5 === 0) {
      console.log(`  Generated data for ${days - dayOffset} days...`);
    }
  }
  
  console.log(`✓ Generated ${totalMeasurements} sample measurements`);
}

// Aggregate historical data from measurements
async function generateHistoricalData(days = 30) {
  console.log(`Generating historical data for last ${days} days...`);
  
  const { aggregateHistoricalData } = require('../services/dataAggregation');
  const results = await aggregateHistoricalData(days);
  
  const totalAggregated = results.reduce((sum, result) => sum + (result.count || 0), 0);
  console.log(`✓ Generated ${totalAggregated} historical data records`);
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Ensure database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('✓ Database synchronized');
    
    // Seed data in order
    await seedCities();
    await seedPollutants();
    await seedLocations();
    await generateSampleMeasurements(30);
    await generateHistoricalData(30);
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Quick seed function for minimal data
async function quickSeed() {
  try {
    console.log('🚀 Quick seeding for development...');
    
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    
    await seedCities();
    await seedPollutants();
    await seedLocations();
    await generateSampleMeasurements(7); // Only last 7 days
    
    console.log('✓ Quick seed completed!');
    
  } catch (error) {
    console.error('❌ Error in quick seed:', error);
    throw error;
  }
}

// Clean database (for testing)
async function cleanDatabase() {
  try {
    console.log('🧹 Cleaning database...');
    
    await sequelize.sync({ force: true });
    console.log('✓ Database cleaned');
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'clean':
      cleanDatabase().then(() => process.exit(0));
      break;
    case 'quick':
      quickSeed().then(() => process.exit(0));
      break;
    default:
      seedDatabase().then(() => process.exit(0));
  }
}

module.exports = {
  seedDatabase,
  quickSeed,
  cleanDatabase,
  seedCities,
  seedPollutants,
  seedLocations,
  generateSampleMeasurements,
  generateHistoricalData
};
