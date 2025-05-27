
const axios = require('axios');
const { Measurement, Location, Pollutant } = require('../models');

// OpenAQ API configuration
const OPENAQ_BASE_URL = 'https://api.openaq.org/v2';
const API_KEY = process.env.OPENAQ_API_KEY; // Optional, for higher rate limits

// Create axios instance
const openaqApi = axios.create({
  baseURL: OPENAQ_BASE_URL,
  timeout: 10000,
  headers: {
    'X-API-Key': API_KEY || ''
  }
});

// Fetch latest measurements from OpenAQ
async function fetchAirQualityData() {
  try {
    console.log('Fetching air quality data from OpenAQ...');
    
    // Get locations from our database
    const locations = await Location.findAll({
      include: ['city']
    });
    
    let totalFetched = 0;
    
    for (const location of locations) {
      try {
        // Fetch measurements for this location
        const response = await openaqApi.get('/measurements', {
          params: {
            coordinates: `${location.latitude},${location.longitude}`,
            radius: 5000, // 5km radius
            limit: 100,
            order_by: 'datetime',
            sort: 'desc'
          }
        });
        
        if (response.data && response.data.results) {
          await processMeasurements(response.data.results, location);
          totalFetched += response.data.results.length;
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error fetching data for location ${location.name}:`, error.message);
      }
    }
    
    console.log(`Successfully fetched ${totalFetched} measurements`);
    return { success: true, count: totalFetched };
    
  } catch (error) {
    console.error('Error in fetchAirQualityData:', error);
    throw error;
  }
}

// Process and store measurements
async function processMeasurements(measurements, location) {
  const { calculateAQI, getAQILevel } = require('../utils/aqiCalculator');
  
  for (const measurement of measurements) {
    try {
      // Find or create pollutant
      const [pollutant] = await Pollutant.findOrCreate({
        where: { name: measurement.parameter },
        defaults: {
          name: measurement.parameter,
          fullName: getPollutantFullName(measurement.parameter),
          unit: measurement.unit,
          description: `${measurement.parameter.toUpperCase()} measurements`
        }
      });
      
      // Calculate AQI
      const aqi = calculateAQI(measurement.value, measurement.parameter);
      const aqiLevel = getAQILevel(aqi);
      
      // Create or update measurement
      await Measurement.findOrCreate({
        where: {
          locationId: location.id,
          pollutantId: pollutant.id,
          timestamp: new Date(measurement.date.utc)
        },
        defaults: {
          locationId: location.id,
          pollutantId: pollutant.id,
          value: measurement.value,
          unit: measurement.unit,
          timestamp: new Date(measurement.date.utc),
          source: 'openaq',
          aqi,
          aqiLevel
        }
      });
      
    } catch (error) {
      console.error('Error processing measurement:', error);
    }
  }
}

// Get full name for pollutant
function getPollutantFullName(parameter) {
  const names = {
    'pm25': 'Fine Particulate Matter',
    'pm10': 'Particulate Matter',
    'no2': 'Nitrogen Dioxide',
    'so2': 'Sulfur Dioxide',
    'co': 'Carbon Monoxide',
    'o3': 'Ozone',
    'bc': 'Black Carbon'
  };
  return names[parameter] || parameter.toUpperCase();
}

// Fetch specific city data
async function fetchCityData(cityName) {
  try {
    const response = await openaqApi.get('/locations', {
      params: {
        city: cityName,
        limit: 50
      }
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error(`Error fetching city data for ${cityName}:`, error);
    return [];
  }
}

module.exports = {
  fetchAirQualityData,
  fetchCityData,
  processMeasurements
};
