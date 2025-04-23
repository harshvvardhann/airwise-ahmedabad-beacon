
const { Pollutant } = require('../models');

exports.getAllPollutants = async (req, res) => {
  try {
    const pollutants = await Pollutant.findAll();
    return res.status(200).json(pollutants);
  } catch (error) {
    console.error('Error fetching pollutants:', error);
    return res.status(500).json({ message: 'Failed to fetch pollutants', error: error.message });
  }
};

exports.getPollutantById = async (req, res) => {
  try {
    const pollutant = await Pollutant.findByPk(req.params.id);
    
    if (!pollutant) {
      return res.status(404).json({ message: 'Pollutant not found' });
    }
    
    return res.status(200).json(pollutant);
  } catch (error) {
    console.error('Error fetching pollutant:', error);
    return res.status(500).json({ message: 'Failed to fetch pollutant', error: error.message });
  }
};

exports.createPollutant = async (req, res) => {
  try {
    const { name, description, unit, fullName } = req.body;
    
    if (!name || !unit) {
      return res.status(400).json({ message: 'Name and unit are required' });
    }
    
    const pollutant = await Pollutant.create({ name, description, unit, fullName });
    return res.status(201).json(pollutant);
  } catch (error) {
    console.error('Error creating pollutant:', error);
    return res.status(500).json({ message: 'Failed to create pollutant', error: error.message });
  }
};

exports.updatePollutant = async (req, res) => {
  try {
    const { name, description, unit, fullName } = req.body;
    const pollutant = await Pollutant.findByPk(req.params.id);
    
    if (!pollutant) {
      return res.status(404).json({ message: 'Pollutant not found' });
    }
    
    await pollutant.update({ name, description, unit, fullName });
    return res.status(200).json(pollutant);
  } catch (error) {
    console.error('Error updating pollutant:', error);
    return res.status(500).json({ message: 'Failed to update pollutant', error: error.message });
  }
};

exports.deletePollutant = async (req, res) => {
  try {
    const pollutant = await Pollutant.findByPk(req.params.id);
    
    if (!pollutant) {
      return res.status(404).json({ message: 'Pollutant not found' });
    }
    
    await pollutant.destroy();
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting pollutant:', error);
    return res.status(500).json({ message: 'Failed to delete pollutant', error: error.message });
  }
};
