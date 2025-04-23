
const { Location, City } = require('../models');

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: [{ model: City, as: 'city' }]
    });
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id, {
      include: [{ model: City, as: 'city' }]
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    return res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    return res.status(500).json({ message: 'Failed to fetch location', error: error.message });
  }
};

exports.getLocationsByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;
    const locations = await Location.findAll({
      where: { cityId },
      include: [{ model: City, as: 'city' }]
    });
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations by city:', error);
    return res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { cityId, name, latitude, longitude } = req.body;
    
    if (!cityId || !name || !latitude || !longitude) {
      return res.status(400).json({ message: 'City ID, name, latitude, and longitude are required' });
    }
    
    const city = await City.findByPk(cityId);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    const location = await Location.create({ cityId, name, latitude, longitude });
    return res.status(201).json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({ message: 'Failed to create location', error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const location = await Location.findByPk(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    await location.update({ name, latitude, longitude });
    return res.status(200).json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    await location.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting location:', error);
    return res.status(500).json({ message: 'Failed to delete location', error: error.message });
  }
};
