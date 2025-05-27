
const { generatePredictions, getPredictions } = require('../services/mlPredictions');
const { Location, City } = require('../models');

exports.getPredictionsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { days = 7 } = req.query;
    
    // Validate location exists
    const location = await Location.findByPk(locationId, {
      include: [{ model: City, as: 'city' }]
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    const predictions = await getPredictions(locationId, parseInt(days));
    
    return res.status(200).json({
      location: {
        id: location.id,
        name: location.name,
        city: location.city.name,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      },
      predictions: predictions.map(p => ({
        date: p.timestamp,
        data: p.predictionData
      })),
      metadata: {
        days: predictions.length,
        generated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error getting predictions:', error);
    return res.status(500).json({ 
      message: 'Failed to get predictions', 
      error: error.message 
    });
  }
};

exports.generatePredictionsForLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { days = 7 } = req.body;
    
    // Validate location exists
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    const predictions = await generatePredictions(locationId, parseInt(days));
    
    return res.status(200).json({
      message: 'Predictions generated successfully',
      locationId,
      days: predictions.length,
      predictions
    });
    
  } catch (error) {
    console.error('Error generating predictions:', error);
    return res.status(500).json({ 
      message: 'Failed to generate predictions', 
      error: error.message 
    });
  }
};

exports.getAllPredictions = async (req, res) => {
  try {
    const { days = 7, cityId } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    let locations;
    if (cityId) {
      locations = await Location.findAll({
        where: { cityId },
        limit,
        offset
      });
    } else {
      locations = await Location.findAll({
        limit,
        offset,
        include: [{ model: City, as: 'city' }]
      });
    }
    
    const allPredictions = [];
    
    for (const location of locations) {
      try {
        const predictions = await getPredictions(location.id, parseInt(days));
        
        if (predictions.length > 0) {
          allPredictions.push({
            location: {
              id: location.id,
              name: location.name,
              city: location.city?.name || 'Unknown',
              coordinates: {
                latitude: location.latitude,
                longitude: location.longitude
              }
            },
            predictions: predictions.map(p => ({
              date: p.timestamp,
              data: p.predictionData
            }))
          });
        }
      } catch (error) {
        console.error(`Error getting predictions for location ${location.id}:`, error.message);
      }
    }
    
    return res.status(200).json({
      predictions: allPredictions,
      metadata: {
        total: allPredictions.length,
        days: parseInt(days),
        generated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error getting all predictions:', error);
    return res.status(500).json({ 
      message: 'Failed to get predictions', 
      error: error.message 
    });
  }
};
