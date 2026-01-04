const { fetchAirQualityData } = require('./fetch-air-quality-data');
const { aggregateDailyData } = require('./aggregate-daily-data');
const { cleanOldData } = require('./clean-old-data');

/**
 * Initialize all cron jobs
 * This file is required in server.js to start all scheduled tasks
 */
fetchAirQualityData();
aggregateDailyData();
cleanOldData();

console.log('✅ All cron jobs initialized successfully');

