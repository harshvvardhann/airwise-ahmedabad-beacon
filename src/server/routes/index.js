
const express = require('express');
const router = express.Router();

const cityRoutes = require('./city.routes');
const locationRoutes = require('./location.routes');
const pollutantRoutes = require('./pollutant.routes');
const measurementRoutes = require('./measurement.routes');
const historicalRoutes = require('./historical.routes');
const predictionsRoutes = require('./predictions.routes');

// Register routes
router.use('/cities', cityRoutes);
router.use('/locations', locationRoutes);
router.use('/pollutants', pollutantRoutes);
router.use('/measurements', measurementRoutes);
router.use('/historical', historicalRoutes);
router.use('/predictions', predictionsRoutes);

// API root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'AirWise API',
    version: '1.0.0',
    documentation: 'https://api.airwise.com/docs',
    endpoints: {
      cities: '/api/cities',
      locations: '/api/locations',
      pollutants: '/api/pollutants',
      measurements: '/api/measurements',
      historical: '/api/historical',
      predictions: '/api/predictions'
    },
    features: [
      'Real-time air quality monitoring',
      'Historical data analysis',
      'AQI calculations',
      'ML-based predictions',
      'Data export capabilities',
      'Rate limiting and caching',
      'Comprehensive validation'
    ],
    limits: {
      general: '1000 requests per 15 minutes',
      dataFetch: '10 requests per minute',
      export: '20 requests per hour',
      externalAPI: '5 requests per 5 minutes'
    }
  });
});

module.exports = router;
