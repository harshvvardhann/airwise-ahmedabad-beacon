const { CronJob } = require('cron');
const { fetchAirQualityData } = require('../../../services/openaq');

/**
 * Cron Job: Fetch Air Quality Data
 * Schedule: Every hour at minute 0
 * Pattern: '0 * * * *'
 * Timezone: Asia/Kolkata
 * Description: Fetches latest air quality measurements from OpenAQ API
 *              and stores them in the database for all registered locations.
 */
exports.fetchAirQualityData = () => {
    new CronJob(
        '0 * * * *',
        async function () {
            try {
                console.log('🔄 Running scheduled task: Fetching latest air quality data');
                const result = await fetchAirQualityData();
                console.log(`✅ Scheduled data fetch completed: ${result.count} measurements`);
            } catch (error) {
                console.error('❌ Scheduled data fetch failed:', error);
            }
        },
        null,
        true,
        'Asia/Kolkata'
    );
};
