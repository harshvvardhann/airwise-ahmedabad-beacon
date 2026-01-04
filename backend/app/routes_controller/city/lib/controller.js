const db = require('../../../db/models');
const { status, common } = require('../../../../utils');

// find all
exports.findAll = async (req, res) => {
    try {
        const cities = await db.City.findAll({
            include: [
                {
                    model: db.Location,
                    as: 'locations',
                    attributes: ['id', 'name', 'latitude', 'longitude'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return res.status(status.OK).json({ data: cities });
    } catch (err) {
        return common.throwException(err, 'Get City', req, res);
    }
};

// find by id
exports.findOne = async (req, res) => {
    try {
        const city = await db.City.findByPk(req.params.id, {
            include: [
                {
                    model: db.Location,
                    as: 'locations',
                    attributes: ['id', 'name', 'latitude', 'longitude'],
                },
            ],
        });

        if (!city) {
            return res.status(status.NotFound).json({ message: 'City not found.' });
        }

        return res.status(status.OK).json({ data: city });
    } catch (err) {
        return common.throwException(err, 'Get City', req, res);
    }
};

// create city
exports.create = async (req, res) => {
    try {
        const cityData = {
            name: req.body.name,
            country: req.body.country,
        };
        await db.City.create(cityData);
        return res.status(status.OK).json({ message: 'City created successfully.' });
    } catch (err) {
        return common.throwException(err, 'Create City', req, res);
    }
};

// update city
exports.update = async (req, res) => {
    try {
        const cityData = {
            name: req.body.name,
            country: req.body.country,
        };

        const city = await db.City.findByPk(req.params.id);

        if (!city) {
            return res.status(status.NotFound).json({ message: 'City not found.' });
        }

        city.set(cityData);
        await city.save();

        return res.status(status.OK).json({ message: 'City updated successfully.' });
    } catch (err) {
        return common.throwException(err, 'Update City', req, res);
    }
};

// delete city
exports.delete = async (req, res) => {
    try {
        const city = await db.City.findByPk(req.params.id);

        if (!city) {
            return res.status(status.NotFound).json({ message: 'City not found.' });
        }

        await city.destroy();

        return res.status(status.OK).json({ message: 'City deleted successfully.' });
    } catch (err) {
        return common.throwException(err, 'Delete City', req, res);
    }
};

