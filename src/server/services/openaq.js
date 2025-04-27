const axios = require('axios');
const { City, Location, Pollutant, Measurement } = require('../models');
const { publishAirQualityData } = require('./kafka');

// OpenAQ API base URL
const OPENAQ_API = 'https://api.openaq.org/v2';

// Redis cache keys
const CACHE_KEYS = {
  LATEST_AQI: 'latest:aqi',
  LOCATION_DATA: 'location:data:',
  ALL_LOCATIONS: 'all:locations',
};

// Cache TTL in seconds
const CACHE_TTL = {
  LATEST_AQI: 300, // 5 minutes
  LOCATION_DATA: 600, // 10 minutes
  ALL_LOCATIONS: 1800, // 30 minutes
};

// Function to fetch air quality data from OpenAQ API
exports.fetchAirQualityData = async (req, res) => {
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
    const savedCount = await processResults(results, ahmedabad.id, req?.app?.locals?.redisClient);
    
    return { count: savedCount };
  } catch (error) {
    console.error('Error fetching data from OpenAQ:', error);
    throw error;
  }
};

// Process the results and save to database
async function processResults(results, cityId, redisClient = null) {
  let savedCount = 0;
  let locationMeasurements = {};
  
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
      
      // Create measurement
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
      
      // Aggregate measurements by location for Kafka
      if (!locationMeasurements[location.name]) {
        locationMeasurements[location.name] = {
          location: location.name,
          city: 'Ahmedabad',
          coordinates: [location.latitude, location.longitude],
          timestamp: new Date(result.date.utc).toISOString(),
          measurements: {},
          aqi: 0,
          level: 'good'
        };
      }
      
      locationMeasurements[location.name].measurements[pollutant.name] = result.value;
      
      // Update AQI if higher
      if (aqi > locationMeasurements[location.name].aqi) {
        locationMeasurements[location.name].aqi = aqi;
        locationMeasurements[location.name].level = level;
      }
      
    } catch (error) {
      console.error(`Error processing measurement for ${result.location}:`, error);
    }
  }
  
  console.log(`Saved ${savedCount} new measurements to database`);
  
  // Cache data in Redis if available
  if (redisClient) {
    try {
      // Cache all the latest location data
      const allLocations = Object.values(locationMeasurements);
      
      // Store each location data individually
      for (const locationData of allLocations) {
        const locationCacheKey = `${CACHE_KEYS.LOCATION_DATA}${locationData.location}`;
        await redisClient.setex(
          locationCacheKey,
          CACHE_TTL.LOCATION_DATA,
          JSON.stringify(locationData)
        );
      }
      
      // Store all locations array
      await redisClient.setex(
        CACHE_KEYS.ALL_LOCATIONS,
        CACHE_TTL.ALL_LOCATIONS,
        JSON.stringify(allLocations)
      );
      
      console.log('Successfully cached air quality data in Redis');
    } catch (redisError) {
      console.error('Error caching data in Redis:', redisError);
      // Non-blocking - continue even if Redis caching fails
    }
  }
  
  // Publish aggregated data to Kafka
  for (const locationName in locationMeasurements) {
    try {
      await publishAirQualityData(locationMeasurements[locationName]);
      console.log(`Published data to Kafka for ${locationName}`);
    } catch (error) {
      console.error(`Error publishing data to Kafka for ${locationName}:`, error);
    }
  }
  
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

// Simple AQI calculation
function calculateAQI(pollutant, value) {
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
