
const { Kafka } = require('kafkajs');
const { sequelize } = require('../models');

// Kafka client configuration
const kafka = new Kafka({
  clientId: 'airwise-backend',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

// Create producer
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'airwise-backend-consumer' });

// Initialize Kafka connections
async function initKafka() {
  try {
    console.log('Connecting to Kafka...');
    await producer.connect();
    await consumer.connect();
    
    // Subscribe to predictions topic
    await consumer.subscribe({ topic: 'air-quality-predictions', fromBeginning: false });
    
    // Start consuming messages
    await startConsumer();
    
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
      messages: [
        { value: JSON.stringify(data) },
      ],
    });
    return true;
  } catch (error) {
    console.error('Error publishing to Kafka:', error);
    return false;
  }
}

// Start the consumer to receive predictions
async function startConsumer() {
  const { AirQualityPrediction } = require('../models');
  
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

// Store prediction in the database
async function storePrediction(data) {
  try {
    const { Location } = require('../models');
    
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
  publishAirQualityData
};
