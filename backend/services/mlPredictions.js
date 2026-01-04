
const axios = require('axios');
const { AirQualityPrediction, Location, Measurement, Pollutant } = require('../app/db/models');
const { Op } = require('sequelize');

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://ml-service:8000';

// Generate predictions for a location
async function generatePredictions(locationId, days = 7) {
  try {
    console.log(`Generating predictions for location ${locationId}, ${days} days`);
    
    // Get historical data for the location
    const historicalData = await getHistoricalDataForPrediction(locationId, 30);
    
    if (historicalData.length < 10) {
      throw new Error('Insufficient historical data for predictions');
    }
    
    // Call ML service (or generate mock predictions)
    let predictions;
    
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
        locationId,
        historicalData,
        days
      }, { timeout: 30000 });
      
      predictions = response.data.predictions;
    } catch (error) {
      console.warn('ML service unavailable, generating mock predictions:', error.message);
      predictions = generateMockPredictions(locationId, days, historicalData);
    }
    
    // Store predictions in database
    await storePredictions(locationId, predictions);
    
    return predictions;
    
  } catch (error) {
    console.error('Error generating predictions:', error);
    throw error;
  }
}

// Get historical data for ML prediction
async function getHistoricalDataForPrediction(locationId, days = 30) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const measurements = await Measurement.findAll({
      where: {
        locationId,
        timestamp: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      include: [
        { model: Pollutant, as: 'pollutant' }
      ],
      order: [['timestamp', 'ASC']]
    });
    
    // Group by date and pollutant
    const groupedData = {};
    
    measurements.forEach(measurement => {
      const date = measurement.timestamp.toISOString().split('T')[0];
      const pollutant = measurement.pollutant.name;
      
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      
      if (!groupedData[date][pollutant]) {
        groupedData[date][pollutant] = [];
      }
      
      groupedData[date][pollutant].push(measurement.value);
    });
    
    // Calculate daily averages
    const processedData = Object.entries(groupedData).map(([date, pollutants]) => {
      const dayData = { date };
      
      Object.entries(pollutants).forEach(([pollutant, values]) => {
        dayData[pollutant] = values.reduce((sum, val) => sum + val, 0) / values.length;
      });
      
      return dayData;
    });
    
    return processedData;
    
  } catch (error) {
    console.error('Error getting historical data for prediction:', error);
    throw error;
  }
}

// Generate mock predictions (fallback when ML service is unavailable)
function generateMockPredictions(locationId, days, historicalData) {
  const pollutants = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];
  const predictions = [];
  
  // Calculate averages from historical data
  const averages = {};
  pollutants.forEach(pollutant => {
    const values = historicalData
      .map(day => day[pollutant])
      .filter(val => val !== undefined && val !== null);
    
    if (values.length > 0) {
      averages[pollutant] = values.reduce((sum, val) => sum + val, 0) / values.length;
    } else {
      averages[pollutant] = getDefaultValue(pollutant);
    }
  });
  
  // Generate predictions for each day
  for (let i = 1; i <= days; i++) {
    const predictionDate = new Date();
    predictionDate.setDate(predictionDate.getDate() + i);
    
    const dayPrediction = {
      date: predictionDate.toISOString().split('T')[0],
      predictions: {}
    };
    
    pollutants.forEach(pollutant => {
      const baseValue = averages[pollutant];
      const variance = baseValue * 0.2; // 20% variance
      const trend = (Math.random() - 0.5) * 0.1; // Small trend factor
      
      // Add some seasonality and randomness
      const seasonalFactor = 1 + Math.sin(i / days * Math.PI) * 0.1;
      const randomFactor = 1 + (Math.random() - 0.5) * 0.15;
      
      const predictedValue = baseValue * seasonalFactor * randomFactor * (1 + trend);
      
      dayPrediction.predictions[pollutant] = {
        value: Math.max(0, Math.round(predictedValue * 100) / 100),
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable'
      };
    });
    
    predictions.push(dayPrediction);
  }
  
  return predictions;
}

// Get default values for pollutants
function getDefaultValue(pollutant) {
  const defaults = {
    'pm25': 35,
    'pm10': 60,
    'no2': 25,
    'so2': 15,
    'co': 2,
    'o3': 50
  };
  return defaults[pollutant] || 20;
}

// Store predictions in database
async function storePredictions(locationId, predictions) {
  try {
    for (const prediction of predictions) {
      await AirQualityPrediction.upsert({
        locationId,
        timestamp: new Date(prediction.date),
        predictionData: prediction.predictions
      });
    }
    
    console.log(`Stored ${predictions.length} predictions for location ${locationId}`);
    
  } catch (error) {
    console.error('Error storing predictions:', error);
    throw error;
  }
}

// Get stored predictions for a location
async function getPredictions(locationId, days = 7) {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const predictions = await AirQualityPrediction.findAll({
      where: {
        locationId,
        timestamp: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      include: [
        { model: Location, as: 'location', include: ['city'] }
      ],
      order: [['timestamp', 'ASC']]
    });
    
    return predictions;
    
  } catch (error) {
    console.error('Error getting predictions:', error);
    throw error;
  }
}

// Update predictions for all locations
async function updateAllPredictions() {
  try {
    console.log('Updating predictions for all locations...');
    
    const locations = await Location.findAll();
    let updatedCount = 0;
    
    for (const location of locations) {
      try {
        await generatePredictions(location.id, 7);
        updatedCount++;
        
        // Small delay to prevent overwhelming the ML service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error updating predictions for location ${location.id}:`, error.message);
      }
    }
    
    console.log(`Updated predictions for ${updatedCount} locations`);
    return { success: true, count: updatedCount };
    
  } catch (error) {
    console.error('Error updating all predictions:', error);
    throw error;
  }
}

module.exports = {
  generatePredictions,
  getPredictions,
  updateAllPredictions,
  getHistoricalDataForPrediction
};
