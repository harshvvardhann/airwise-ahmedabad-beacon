'use strict';

const db = require('../../../../app/db/models');
const { status, common } = require('../../../../utils');

// find all locations
exports.findAll = async (req, res) => {
    try {
        const locations = await db.Location.findAll({
            include: [
                {
                    model: db.City,
                    as: 'city',
                    attributes: ['id', 'name', 'country'],
                },
            ],
            order: [['name', 'ASC']],
        });

        // Transform to match frontend format
        const formattedLocations = locations.map((location) => ({
            id: location.id.toString(),
            name: location.name,
            city: location.city?.name || '',
            coordinates: [location.latitude, location.longitude],
        }));

        return res.status(status.OK).json({ data: formattedLocations });
    } catch (err) {
        return common.throwException(err, 'Get Locations', req, res);
    }
};

// find location by id
exports.findOne = async (req, res) => {
    try {
        const location = await db.Location.findByPk(req.params.id, {
            include: [
                {
                    model: db.City,
                    as: 'city',
                    attributes: ['id', 'name', 'country'],
                },
            ],
        });

        if (!location) {
            return res.status(status.NotFound).json({ message: 'Location not found.' });
        }

        return res.status(status.OK).json({ data: location });
    } catch (err) {
        return common.throwException(err, 'Get Location', req, res);
    }
};

