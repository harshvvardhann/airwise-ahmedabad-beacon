
const express = require('express');
const router = express.Router();

const cityRoutes = require('./city.routes');
const locationRoutes = require('./location.routes');
const pollutantRoutes = require('./pollutant.routes');
const measurementRoutes = require('./measurement.routes');
const historicalRoutes = require('./historical.routes');

// Register routes
router.use('/cities', cityRoutes);
router.use('/locations', locationRoutes);
router.use('/pollutants', pollutantRoutes);
router.use('/measurements', measurementRoutes);
router.use('/historical', historicalRoutes);

// API root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'AirWise API',
    version: '1.0.0',
    endpoints: [
      '/cities',
      '/locations',
      '/pollutants',
      '/measurements',
      '/historical',
    ],
  });
});

module.exports = router;
