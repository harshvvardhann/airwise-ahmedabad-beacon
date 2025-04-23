
const { Measurement, Location, Pollutant, sequelize } = require('../models');
const { Op } = require('sequelize');
const { fetchAirQualityData } = require('../services/openaq');

exports.getAllMeasurements = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const measurements = await Measurement.findAll({
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return res.status(500).json({ message: 'Failed to fetch measurements', error: error.message });
  }
};

exports.getLatestMeasurements = async (req, res) => {
  try {
    // Get the latest measurement for each location and pollutant
    const latestMeasurements = await Measurement.findAll({
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT MAX(id) FROM measurements
            GROUP BY location_id, pollutant_id
          )`)
        }
      },
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(latestMeasurements);
  } catch (error) {
    console.error('Error fetching latest measurements:', error);
    return res.status(500).json({ message: 'Failed to fetch latest measurements', error: error.message });
  }
};

exports.getMeasurementById = async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id, {
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ]
    });
    
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    
    return res.status(200).json(measurement);
  } catch (error) {
    console.error('Error fetching measurement:', error);
    return res.status(500).json({ message: 'Failed to fetch measurement', error: error.message });
  }
};

exports.getMeasurementsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const measurements = await Measurement.findAll({
      where: { locationId },
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(measurements);
  } catch (error) {
    console.error('Error fetching measurements by location:', error);
    return res.status(500).json({ message: 'Failed to fetch measurements', error: error.message });
  }
};

exports.getMeasurementsByPollutant = async (req, res) => {
  try {
    const { pollutantId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const measurements = await Measurement.findAll({
      where: { pollutantId },
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(measurements);
  } catch (error) {
    console.error('Error fetching measurements by pollutant:', error);
    return res.status(500).json({ message: 'Failed to fetch measurements', error: error.message });
  }
};

exports.filterMeasurements = async (req, res) => {
  try {
    const { locationId, pollutantId, startDate, endDate } = req.query;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const whereClause = {};
    
    if (locationId) whereClause.locationId = locationId;
    if (pollutantId) whereClause.pollutantId = pollutantId;
    
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
      if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
    }
    
    const measurements = await Measurement.findAll({
      where: whereClause,
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['timestamp', 'DESC']]
    });
    
    return res.status(200).json(measurements);
  } catch (error) {
    console.error('Error filtering measurements:', error);
    return res.status(500).json({ message: 'Failed to filter measurements', error: error.message });
  }
};

exports.createMeasurement = async (req, res) => {
  try {
    const { locationId, pollutantId, value, unit, source, timestamp, aqi, aqiLevel } = req.body;
    
    if (!locationId || !pollutantId || value === undefined || !unit || !timestamp) {
      return res.status(400).json({ message: 'LocationId, pollutantId, value, unit, and timestamp are required' });
    }
    
    const measurement = await Measurement.create({
      locationId, pollutantId, value, unit, source, timestamp, aqi, aqiLevel
    });
    
    return res.status(201).json(measurement);
  } catch (error) {
    console.error('Error creating measurement:', error);
    return res.status(500).json({ message: 'Failed to create measurement', error: error.message });
  }
};

exports.updateMeasurement = async (req, res) => {
  try {
    const { value, unit, source, aqi, aqiLevel } = req.body;
    const measurement = await Measurement.findByPk(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    
    await measurement.update({ value, unit, source, aqi, aqiLevel });
    return res.status(200).json(measurement);
  } catch (error) {
    console.error('Error updating measurement:', error);
    return res.status(500).json({ message: 'Failed to update measurement', error: error.message });
  }
};

exports.deleteMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findByPk(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    
    await measurement.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting measurement:', error);
    return res.status(500).json({ message: 'Failed to delete measurement', error: error.message });
  }
};

exports.fetchLatestData = async (req, res) => {
  try {
    const result = await fetchAirQualityData();
    return res.status(200).json({ 
      message: 'Data fetch successful', 
      count: result.count,
    });
  } catch (error) {
    console.error('Error fetching latest data:', error);
    return res.status(500).json({ message: 'Failed to fetch latest data', error: error.message });
  }
};
