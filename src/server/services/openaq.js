
const axios = require('axios');
const { City, Location, Pollutant, Measurement } = require('../models');

// OpenAQ API base URL
const OPENAQ_API = 'https://api.openaq.org/v2';

// Function to fetch air quality data from OpenAQ API
exports.fetchAirQualityData = async () => {
  try {
    console.log('Fetching air quality data for Ahmedabad...');
    
    // First, ensure we have Ahmedabad in our database
    let [ahmedabad] = await City.findOrCreate({
      where: { name: 'Ahmedabad' },
      defaults: {
        name: 'Ahmedabad',
        country: 'India'
      }
    });
    
    // Fetch latest measurements from OpenAQ API for Ahmedabad
    const response = await axios.get(`${OPENAQ_API}/measurements`, {
      params: {
        city: 'Ahmedabad',
        limit: 1000,
        has_geo: true
      }
    });
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid response from OpenAQ API');
    }
    
    const results = response.data.results;
    console.log(`Fetched ${results.length} measurements from OpenAQ`);
    
    // Process each result
    const savedCount = await processResults(results, ahmedabad.id);
    
    return { count: savedCount };
  } catch (error) {
    console.error('Error fetching data from OpenAQ:', error);
    throw error;
  }
};

// Process the results and save to database
async function processResults(results, cityId) {
  let savedCount = 0;
  
  for (const result of results) {
    try {
      // Skip if missing required data
      if (!result.parameter || result.value === undefined || !result.unit || !result.coordinates || !result.location) {
        continue;
      }
      
      // Find or create pollutant
      const [pollutant] = await Pollutant.findOrCreate({
        where: { name: result.parameter.toLowerCase() },
        defaults: {
          name: result.parameter.toLowerCase(),
          description: `${result.parameter} measurements`,
          unit: result.unit,
          fullName: getFullName(result.parameter)
        }
      });
      
      // Find or create location
      const [location] = await Location.findOrCreate({
        where: {
          name: result.location,
          cityId: cityId
        },
        defaults: {
          name: result.location,
          cityId: cityId,
          latitude: result.coordinates.latitude,
          longitude: result.coordinates.longitude
        }
      });
      
      // Calculate AQI and level (simplified version)
      const { aqi, level } = calculateAQI(result.parameter.toLowerCase(), result.value);
      
      // Create measurement (using findOrCreate to avoid duplicates)
      const [measurement, created] = await Measurement.findOrCreate({
        where: {
          locationId: location.id,
          pollutantId: pollutant.id,
          timestamp: new Date(result.date.utc)
        },
        defaults: {
          locationId: location.id,
          pollutantId: pollutant.id,
          value: result.value,
          unit: result.unit,
          source: 'OpenAQ',
          timestamp: new Date(result.date.utc),
          aqi,
          aqiLevel: level
        }
      });
      
      if (created) {
        savedCount++;
      }
    } catch (error) {
      console.error(`Error processing measurement for ${result.location}:`, error);
    }
  }
  
  console.log(`Saved ${savedCount} new measurements to database`);
  return savedCount;
}

// Get full name for pollutants
function getFullName(parameter) {
  const map = {
    pm25: 'Fine Particulate Matter',
    pm10: 'Particulate Matter',
    no2: 'Nitrogen Dioxide',
    so2: 'Sulfur Dioxide',
    co: 'Carbon Monoxide',
    o3: 'Ozone',
    bc: 'Black Carbon'
  };
  
  return map[parameter.toLowerCase()] || parameter;
}

// Simple AQI calculation (this is a simplified version - real AQI calculation is more complex)
function calculateAQI(pollutant, value) {
  // This is a very simplified AQI calculation
  // In a real-world application, you would use standard EPA or WHO formulas
  
  let aqi, level;
  
  switch(pollutant) {
    case 'pm25':
      if (value <= 12) { aqi = Math.round((value / 12) * 50); level = 'good'; }
      else if (value <= 35.4) { aqi = Math.round(((value - 12) / 23.4) * 50) + 50; level = 'moderate'; }
      else if (value <= 55.4) { aqi = Math.round(((value - 35.4) / 20) * 50) + 100; level = 'unhealthy'; }
      else { aqi = 150 + Math.round(value); level = 'bad'; }
      break;
      
    case 'pm10':
      if (value <= 54) { aqi = Math.round((value / 54) * 50); level = 'good'; }
      else if (value <= 154) { aqi = Math.round(((value - 54) / 100) * 50) + 50; level = 'moderate'; }
      else if (value <= 254) { aqi = Math.round(((value - 154) / 100) * 50) + 100; level = 'unhealthy'; }
      else { aqi = 150 + Math.round(value / 2); level = 'bad'; }
      break;
      
    case 'o3':
      if (value <= 54) { aqi = Math.round((value / 54) * 50); level = 'good'; }
      else if (value <= 124) { aqi = Math.round(((value - 54) / 70) * 50) + 50; level = 'moderate'; }
      else { aqi = 100 + Math.round(value / 2); level = 'unhealthy'; }
      break;
      
    // Add similar logic for other pollutants
    
    default:
      // Default simple calculation for other pollutants
      if (value <= 50) { aqi = value; level = 'good'; }
      else if (value <= 100) { aqi = value; level = 'moderate'; }
      else if (value <= 150) { aqi = value; level = 'unhealthy'; }
      else { aqi = value; level = 'bad'; }
  }
  
  // Ensure AQI is between 0 and 500
  aqi = Math.min(500, Math.max(0, aqi));
  
  // If aqi is very high, mark as severe
  if (aqi > 300) level = 'severe';
  
  return { aqi, level };
}
