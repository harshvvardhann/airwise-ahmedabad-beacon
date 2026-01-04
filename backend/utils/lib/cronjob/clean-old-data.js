const { CronJob } = require('cron');
const { cleanOldData } = require('../../../services/dataAggregation');

/**
 * Cron Job: Clean Old Data
 * Schedule: Every Sunday at 2:00 AM
 * Pattern: '0 2 * * 0'
 * Timezone: Asia/Kolkata
 * Description: Removes old measurement data to prevent database from growing too large.
 *              Keeps historical aggregated data but removes detailed measurements older than
 *              a specified retention period (typically 90 days).
 */
exports.cleanOldData = () => {
    new CronJob(
        '0 2 * * 0',
        async function () {
            try {
                console.log('🔄 Running scheduled task: Cleaning old data');
                const result = await cleanOldData();
                console.log(`✅ Cleanup completed: ${result.measurements} measurements, ${result.historical} historical records`);
            } catch (error) {
                console.error('❌ Data cleanup failed:', error);
            }
        },
        null,
        true,
        'Asia/Kolkata'
    );
};
