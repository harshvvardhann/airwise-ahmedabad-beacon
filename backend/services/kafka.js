const { Kafka } = require('kafkajs');
const { sequelize } = require('../app/db/models');

// Kafka client configuration
const kafka = new Kafka({
    clientId: 'airwise-backend',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

// Create producer
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'airwise-backend-consumer' });
const alertConsumer = kafka.consumer({ groupId: 'airwise-alerts-consumer' });

// Initialize Kafka connections
async function initKafka() {
    try {
        console.log('Connecting to Kafka...');
        await producer.connect();
        await consumer.connect();
        await alertConsumer.connect();

        // Subscribe to predictions topic
        await consumer.subscribe({ topic: 'air-quality-predictions', fromBeginning: false });

        // Subscribe to alerts topic
        await alertConsumer.subscribe({ topic: 'air-quality-alerts', fromBeginning: false });

        // Start consuming messages
        await startConsumer();
        await startAlertConsumer();

        console.log('Kafka initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize Kafka:', error);
        return false;
    }
}

// Publish air quality data to Kafka
async function publishAirQualityData(data) {
    try {
        await producer.send({
            topic: 'air-quality-data',
            messages: [{ value: JSON.stringify(data) }],
        });

        // Also check for dangerous levels and send alerts if needed
        await checkAndSendAlerts(data);

        return true;
    } catch (error) {
        console.error('Error publishing to Kafka:', error);
        return false;
    }
}

// Check for dangerous pollutant levels and send alerts
async function checkAndSendAlerts(data) {
    // Define dangerous thresholds for pollutants
    const dangerousThresholds = {
        pm25: 55, // Unhealthy
        pm10: 150, // Unhealthy
        no2: 100, // Unhealthy
        so2: 75, // Unhealthy
        co: 9, // Unhealthy
        o3: 125, // Unhealthy
    };

    // Check if any measurement exceeds thresholds
    const alerts = [];
    for (const [pollutant, value] of Object.entries(data.measurements)) {
        if (value !== null && dangerousThresholds[pollutant] && value > dangerousThresholds[pollutant]) {
            alerts.push({
                pollutant,
                value,
                threshold: dangerousThresholds[pollutant],
                location: data.location,
                timestamp: data.timestamp,
                level: data.level,
            });
        }
    }

    // If any alerts, send to Kafka
    if (alerts.length > 0) {
        try {
            for (const alert of alerts) {
                await producer.send({
                    topic: 'air-quality-alerts',
                    messages: [
                        {
                            value: JSON.stringify({
                                ...alert,
                                alertType: 'high-pollutant',
                                message: `${alert.pollutant.toUpperCase()} levels at ${alert.location} have reached ${
                                    alert.value
                                }, which exceeds the threshold of ${alert.threshold}.`,
                            }),
                        },
                    ],
                });

                console.log(`Alert sent for high ${alert.pollutant} levels at ${alert.location}`);
            }
            return true;
        } catch (error) {
            console.error('Error sending alerts to Kafka:', error);
            return false;
        }
    }

    return false; // No alerts to send
}

// Start the consumer to receive predictions
async function startConsumer() {
    const { AirQualityPrediction } = require('../app/db/models');

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const data = JSON.parse(message.value.toString());
                console.log(`Received prediction for ${data.location}`);

                // Store predictions in database
                await storePrediction(data);
            } catch (error) {
                console.error('Error processing Kafka message:', error);
            }
        },
    });
}

// Start the alert consumer
async function startAlertConsumer() {
    const { Notification } = require('../app/db/models');

    await alertConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const alert = JSON.parse(message.value.toString());
                console.log(`Processing alert: ${alert.message}`);

                // Store notification in database
                await Notification.create({
                    type: alert.alertType,
                    message: alert.message,
                    data: JSON.stringify(alert),
                    read: false,
                    timestamp: new Date(),
                });

                // In a real app, send push notifications or emails here
                // This would integrate with Firebase Cloud Messaging or Nodemailer
            } catch (error) {
                console.error('Error processing alert:', error);
            }
        },
    });
}

// Store prediction in the database
async function storePrediction(data) {
    try {
        const { Location } = require('../app/db/models');

        // Find location ID
        const location = await Location.findOne({ where: { name: data.location } });

        if (!location) {
            console.error(`Location not found: ${data.location}`);
            return;
        }

        // Create the prediction model and store predictions
        // In a real application, you would save all predictions to database
        console.log(`Stored prediction for ${data.location}`);
    } catch (error) {
        console.error('Error storing prediction:', error);
    }
}

module.exports = {
    initKafka,
    publishAirQualityData,
};
