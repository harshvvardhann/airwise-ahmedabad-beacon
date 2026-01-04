const { Measurement, HistoricalData, Location, Pollutant, sequelize } = require('../app/db/models');
const { Op } = require('sequelize');

// Aggregate daily data from measurements
async function aggregateDailyData(targetDate = null) {
    try {
        const date = targetDate || new Date();
        date.setDate(date.getDate() - 1); // Yesterday

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        console.log(`Aggregating data for ${startOfDay.toDateString()}`);

        // Get all measurements for the day
        const measurements = await Measurement.findAll({
            where: {
                timestamp: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay,
                },
            },
            include: [
                { model: Location, as: 'location' },
                { model: Pollutant, as: 'pollutant' },
            ],
        });

        // Group by location and pollutant
        const grouped = {};

        measurements.forEach((measurement) => {
            const key = `${measurement.locationId}-${measurement.pollutantId}`;

            if (!grouped[key]) {
                grouped[key] = {
                    locationId: measurement.locationId,
                    pollutantId: measurement.pollutantId,
                    unit: measurement.unit,
                    values: [],
                };
            }

            grouped[key].values.push(measurement.value);
        });

        // Calculate aggregations and store
        let aggregatedCount = 0;

        for (const [key, data] of Object.entries(grouped)) {
            if (data.values.length === 0) continue;

            const values = data.values.sort((a, b) => a - b);
            const sum = values.reduce((acc, val) => acc + val, 0);

            const aggregation = {
                locationId: data.locationId,
                pollutantId: data.pollutantId,
                date: startOfDay.toISOString().split('T')[0],
                value: values[Math.floor(values.length / 2)], // Median
                avgValue: sum / values.length,
                minValue: Math.min(...values),
                maxValue: Math.max(...values),
                unit: data.unit,
            };

            // Insert or update historical data
            await HistoricalData.upsert(aggregation);
            aggregatedCount++;
        }

        console.log(`Aggregated ${aggregatedCount} records for ${startOfDay.toDateString()}`);
        return { success: true, count: aggregatedCount, date: startOfDay.toDateString() };
    } catch (error) {
        console.error('Error in aggregateDailyData:', error);
        throw error;
    }
}

// Aggregate data for multiple days
async function aggregateHistoricalData(days = 30) {
    try {
        const results = [];

        for (let i = 1; i <= days; i++) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - i);

            const result = await aggregateDailyData(targetDate);
            results.push(result);

            // Small delay to prevent overwhelming the database
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log(`Completed aggregation for ${days} days`);
        return results;
    } catch (error) {
        console.error('Error in aggregateHistoricalData:', error);
        throw error;
    }
}

// Get aggregated statistics for a location
async function getLocationStats(locationId, days = 30) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const stats = await HistoricalData.findAll({
            where: {
                locationId,
                date: {
                    [Op.gte]: startDate.toISOString().split('T')[0],
                    [Op.lte]: endDate.toISOString().split('T')[0],
                },
            },
            include: [{ model: Pollutant, as: 'pollutant' }],
            order: [['date', 'ASC']],
        });

        return stats;
    } catch (error) {
        console.error('Error in getLocationStats:', error);
        throw error;
    }
}

// Clean old data (keep only last 2 years)
async function cleanOldData() {
    try {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);

        // Delete old measurements
        const deletedMeasurements = await Measurement.destroy({
            where: {
                timestamp: {
                    [Op.lt]: cutoffDate,
                },
            },
        });

        // Delete old historical data
        const deletedHistorical = await HistoricalData.destroy({
            where: {
                date: {
                    [Op.lt]: cutoffDate.toISOString().split('T')[0],
                },
            },
        });

        console.log(`Cleaned ${deletedMeasurements} old measurements and ${deletedHistorical} historical records`);
        return { measurements: deletedMeasurements, historical: deletedHistorical };
    } catch (error) {
        console.error('Error in cleanOldData:', error);
        throw error;
    }
}

module.exports = {
    aggregateDailyData,
    aggregateHistoricalData,
    getLocationStats,
    cleanOldData,
};
