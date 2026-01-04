const { CronJob } = require('cron');
const { aggregateDailyData } = require('../../../services/dataAggregation');

/**
 * Cron Job: Aggregate Daily Data
 * Schedule: Every day at 1:00 AM
 * Pattern: '0 1 * * *'
 * Timezone: Asia/Kolkata
 * Description: Aggregates all measurements from the previous day into daily summaries
 *              (avg, min, max) and stores them in the historical_data table.
 */
exports.aggregateDailyData = () => {
    new CronJob(
        '0 1 * * *',
        async function () {
            try {
                console.log('🔄 Running scheduled task: Daily data aggregation');
                const result = await aggregateDailyData();
                console.log(`✅ Daily aggregation completed: ${result.count} records for ${result.date}`);
            } catch (error) {
                console.error('❌ Daily aggregation failed:', error);
            }
        },
        null,
        true,
        'Asia/Kolkata'
    );
};
