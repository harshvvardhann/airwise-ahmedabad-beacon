
const { HistoricalData, Location, Pollutant } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

exports.getAllHistoricalData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const data = await HistoricalData.findAll({
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return res.status(500).json({ message: 'Failed to fetch historical data', error: error.message });
  }
};

exports.getHistoricalDataById = async (req, res) => {
  try {
    const data = await HistoricalData.findByPk(req.params.id, {
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ]
    });
    
    if (!data) {
      return res.status(404).json({ message: 'Historical data not found' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return res.status(500).json({ message: 'Failed to fetch historical data', error: error.message });
  }
};

exports.getHistoricalDataByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const data = await HistoricalData.findAll({
      where: { locationId },
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching historical data by location:', error);
    return res.status(500).json({ message: 'Failed to fetch historical data', error: error.message });
  }
};

exports.getHistoricalDataByPollutant = async (req, res) => {
  try {
    const { pollutantId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const data = await HistoricalData.findAll({
      where: { pollutantId },
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching historical data by pollutant:', error);
    return res.status(500).json({ message: 'Failed to fetch historical data', error: error.message });
  }
};

exports.filterHistoricalData = async (req, res) => {
  try {
    const { locationId, pollutantId, startDate, endDate } = req.query;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const whereClause = {};
    
    if (locationId) whereClause.locationId = locationId;
    if (pollutantId) whereClause.pollutantId = pollutantId;
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }
    
    const data = await HistoricalData.findAll({
      where: whereClause,
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      limit,
      offset,
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error filtering historical data:', error);
    return res.status(500).json({ message: 'Failed to filter historical data', error: error.message });
  }
};

exports.createHistoricalData = async (req, res) => {
  try {
    const { locationId, pollutantId, value, unit, date, avgValue, minValue, maxValue } = req.body;
    
    if (!locationId || !pollutantId || value === undefined || !unit || !date || avgValue === undefined || minValue === undefined || maxValue === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const data = await HistoricalData.create({
      locationId, pollutantId, value, unit, date, avgValue, minValue, maxValue
    });
    
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating historical data:', error);
    return res.status(500).json({ message: 'Failed to create historical data', error: error.message });
  }
};

exports.updateHistoricalData = async (req, res) => {
  try {
    const { value, unit, avgValue, minValue, maxValue } = req.body;
    const data = await HistoricalData.findByPk(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: 'Historical data not found' });
    }
    
    await data.update({ value, unit, avgValue, minValue, maxValue });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating historical data:', error);
    return res.status(500).json({ message: 'Failed to update historical data', error: error.message });
  }
};

exports.deleteHistoricalData = async (req, res) => {
  try {
    const data = await HistoricalData.findByPk(req.params.id);
    
    if (!data) {
      return res.status(404).json({ message: 'Historical data not found' });
    }
    
    await data.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting historical data:', error);
    return res.status(500).json({ message: 'Failed to delete historical data', error: error.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { locationId, pollutantId, startDate, endDate, format = 'csv' } = req.query;
    
    const whereClause = {};
    
    if (locationId) whereClause.locationId = locationId;
    if (pollutantId) whereClause.pollutantId = pollutantId;
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = startDate;
      if (endDate) whereClause.date[Op.lte] = endDate;
    }
    
    const data = await HistoricalData.findAll({
      where: whereClause,
      include: [
        { model: Location, as: 'location' },
        { model: Pollutant, as: 'pollutant' }
      ],
      order: [['date', 'DESC']]
    });
    
    if (format === 'json') {
      return res.status(200).json(data);
    }
    
    const fields = [
      'date',
      'value',
      'avgValue',
      'minValue',
      'maxValue',
      'unit',
      'location.name',
      'location.latitude',
      'location.longitude',
      'pollutant.name',
      'pollutant.fullName',
    ];
    
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(data.map(item => ({
      ...item.toJSON(),
      'location.name': item.location?.name,
      'location.latitude': item.location?.latitude,
      'location.longitude': item.location?.longitude,
      'pollutant.name': item.pollutant?.name,
      'pollutant.fullName': item.pollutant?.fullName,
    })));
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`historical_data_export_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    return res.status(500).json({ message: 'Failed to export data', error: error.message });
  }
};
