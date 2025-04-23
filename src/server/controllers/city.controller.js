
const { City } = require('../models');

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json({ message: 'Failed to fetch cities', error: error.message });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id, {
      include: ['locations']
    });
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    return res.status(200).json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    return res.status(500).json({ message: 'Failed to fetch city', error: error.message });
  }
};

exports.createCity = async (req, res) => {
  try {
    const { name, country } = req.body;
    
    if (!name || !country) {
      return res.status(400).json({ message: 'Name and country are required' });
    }
    
    const city = await City.create({ name, country });
    return res.status(201).json(city);
  } catch (error) {
    console.error('Error creating city:', error);
    return res.status(500).json({ message: 'Failed to create city', error: error.message });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { name, country } = req.body;
    const city = await City.findByPk(req.params.id);
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    await city.update({ name, country });
    return res.status(200).json(city);
  } catch (error) {
    console.error('Error updating city:', error);
    return res.status(500).json({ message: 'Failed to update city', error: error.message });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    await city.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting city:', error);
    return res.status(500).json({ message: 'Failed to delete city', error: error.message });
  }
};
