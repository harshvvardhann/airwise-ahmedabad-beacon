'use strict';

const db = require('../../../../app/db/models');
const { status, common } = require('../../../../utils');
const { Op } = require('sequelize');
const { calculateAQI, getAQILevel } = require('../../../../utils/aqiCalculator');

// Get current air quality data for all locations
exports.getCurrent = async (req, res) => {
    try {
        const locations = await db.Location.findAll({
            include: [
                {
                    model: db.City,
                    as: 'city',
                    attributes: ['name', 'country'],
                },
            ],
        });

        const currentData = [];

        for (const location of locations) {
            // Get latest measurements for each pollutant
            const pollutants = await db.Pollutant.findAll();
            const measurements = {};

            for (const pollutant of pollutants) {
                const latestMeasurement = await db.Measurement.findOne({
                    where: {
                        locationId: location.id,
                        pollutantId: pollutant.id,
                    },
                    order: [['timestamp', 'DESC']],
                    include: [
                        {
                            model: db.Pollutant,
                            as: 'pollutant',
                            attributes: ['name', 'unit'],
                        },
                    ],
                });

                if (latestMeasurement) {
                    // Use pollutant name directly as key (already lowercase from seeder)
                    measurements[pollutant.name] = latestMeasurement.value;
                } else {
                    measurements[pollutant.name] = null;
                }
            }

            // Calculate overall AQI from PM2.5 and PM10
            // Use the higher AQI value between PM2.5 and PM10
            const pm25 = measurements.pm25 || null;
            const pm10 = measurements.pm10 || null;
            const pm25AQI = pm25 !== null ? calculateAQI(pm25, 'pm25') : null;
            const pm10AQI = pm10 !== null ? calculateAQI(pm10, 'pm10') : null;
            // Use the maximum AQI value (most restrictive)
            const aqi =
                pm25AQI !== null && pm10AQI !== null
                    ? Math.max(pm25AQI, pm10AQI)
                    : pm25AQI !== null
                    ? pm25AQI
                    : pm10AQI !== null
                    ? pm10AQI
                    : null;
            const level = getAQILevel(aqi);

            // Get latest timestamp
            const latestTimestamp = await db.Measurement.findOne({
                where: { locationId: location.id },
                order: [['timestamp', 'DESC']],
                attributes: ['timestamp'],
            });

            currentData.push({
                location: location.name,
                city: location.city?.name || '',
                coordinates: [location.latitude, location.longitude],
                timestamp: latestTimestamp?.timestamp?.toISOString() || new Date().toISOString(),
                measurements: measurements,
                aqi: aqi,
                level: level,
            });
        }

        return res.status(status.OK).json({ data: currentData });
    } catch (err) {
        return common.throwException(err, 'Get Current Measurements', req, res);
    }
};

// Get historical data
exports.getHistorical = async (req, res) => {
    try {
        const { locationId, pollutantId, dateFrom, dateTo } = req.query;

        const whereClause = {};
        if (locationId) whereClause.locationId = locationId;
        if (pollutantId) whereClause.pollutantId = pollutantId;
        if (dateFrom || dateTo) {
            whereClause.date = {};
            if (dateFrom) whereClause.date[Op.gte] = dateFrom;
            if (dateTo) whereClause.date[Op.lte] = dateTo;
        }

        const historicalData = await db.HistoricalData.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Location,
                    as: 'location',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Pollutant,
                    as: 'pollutant',
                    attributes: ['id', 'name', 'unit'],
                },
            ],
            order: [['date', 'ASC']],
        });

        // Group by date and format for frontend
        const groupedData = {};
        historicalData.forEach((item) => {
            // DATEONLY fields in Sequelize return strings in 'YYYY-MM-DD' format
            // If it's already a string, use it directly; if it's a Date object, convert it
            const dateStr =
                typeof item.date === 'string'
                    ? item.date
                    : item.date instanceof Date
                    ? item.date.toISOString().split('T')[0]
                    : String(item.date).split('T')[0];

            if (!groupedData[dateStr]) {
                groupedData[dateStr] = {
                    date: dateStr,
                    measurements: {},
                };
            }
            // Use pollutant name directly as key (already lowercase from seeder)
            groupedData[dateStr].measurements[item.pollutant.name] = item.avgValue;
        });

        const formattedData = Object.values(groupedData);

        return res.status(status.OK).json({ data: formattedData });
    } catch (err) {
        return common.throwException(err, 'Get Historical Data', req, res);
    }
};
