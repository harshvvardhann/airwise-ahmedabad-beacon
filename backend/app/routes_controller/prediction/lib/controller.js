'use strict';

const db = require('../../../../app/db/models');
const { status, common } = require('../../../../utils');
const { Op } = require('sequelize');

// Get predictions for locations
exports.findAll = async (req, res) => {
    try {
        const { locationId, days = 7 } = req.query;

        const whereClause = {};
        if (locationId) whereClause.locationId = locationId;

        // Get predictions from the last 'days' days and future predictions
        const predictions = await db.AirQualityPrediction.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Location,
                    as: 'location',
                    attributes: ['id', 'name', 'latitude', 'longitude'],
                    include: [
                        {
                            model: db.City,
                            as: 'city',
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: [['timestamp', 'ASC']],
            limit: parseInt(days) * 24, // Assuming hourly predictions
        });

        // Format predictions for frontend
        const formattedPredictions = predictions.map((pred) => {
            const predictionData = pred.predictionData || {};
            return {
                date: pred.timestamp.toISOString().split('T')[0],
                location: pred.location?.name || '',
                city: pred.location?.city?.name || '',
                coordinates: pred.location ? [pred.location.latitude, pred.location.longitude] : [0, 0],
                predictedAQI: predictionData.aqi || null,
                predictedLevel: predictionData.level || null,
                pollutants: predictionData.pollutants || {},
            };
        });

        return res.status(status.OK).json({ data: formattedPredictions });
    } catch (err) {
        return common.throwException(err, 'Get Predictions', req, res);
    }
};

