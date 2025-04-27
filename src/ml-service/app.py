
import json
import time
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from kafka import KafkaConsumer, KafkaProducer
import logging
import os
import joblib
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Kafka configuration
KAFKA_BROKER = os.environ.get('KAFKA_BROKER', 'kafka:9092')
INPUT_TOPIC = 'air-quality-data'
OUTPUT_TOPIC = 'air-quality-predictions'

# Model parameters
POLLUTANTS = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3']
MODEL_PATH = 'models/air_quality_model.joblib'

class AirQualityPredictor:
    def __init__(self):
        self.models = {}
        self.consumer = None
        self.producer = None
        self.connect_kafka()
        
        # Initialize or load models
        self.initialize_models()
        
    def connect_kafka(self):
        """Connect to Kafka broker"""
        retry_count = 0
        
        while retry_count < 5:
            try:
                logger.info(f"Connecting to Kafka broker at {KAFKA_BROKER}")
                self.consumer = KafkaConsumer(
                    INPUT_TOPIC,
                    bootstrap_servers=KAFKA_BROKER,
                    auto_offset_reset='latest',
                    value_deserializer=lambda x: json.loads(x.decode('utf-8')),
                    group_id='air-quality-prediction-group'
                )
                
                self.producer = KafkaProducer(
                    bootstrap_servers=KAFKA_BROKER,
                    value_serializer=lambda x: json.dumps(x).encode('utf-8')
                )
                
                logger.info("Successfully connected to Kafka")
                return
                
            except Exception as e:
                logger.error(f"Failed to connect to Kafka: {str(e)}")
                retry_count += 1
                time.sleep(10)
        
        raise Exception("Failed to connect to Kafka after multiple attempts")
    
    def initialize_models(self):
        """Initialize or load ML models"""
        try:
            # Try to load existing models
            if os.path.exists(MODEL_PATH):
                logger.info("Loading existing models")
                self.models = joblib.load(MODEL_PATH)
            else:
                logger.info("Creating new models")
                # Create a model for each pollutant
                for pollutant in POLLUTANTS:
                    self.models[pollutant] = RandomForestRegressor(
                        n_estimators=100, 
                        random_state=42
                    )
                
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
                joblib.dump(self.models, MODEL_PATH)
                
            logger.info(f"Models initialized for {list(self.models.keys())}")
        except Exception as e:
            logger.error(f"Error initializing models: {str(e)}")
    
    def predict_future_aqi(self, data):
        """
        Predict future AQI levels based on current data
        Data should be in format: {location: str, measurements: {pollutant: value}}
        """
        try:
            location = data.get('location')
            measurements = data.get('measurements', {})
            
            # Prepare feature vector (current values + time features)
            now = datetime.now()
            hour = now.hour
            day_of_week = now.weekday()
            month = now.month
            
            # Simple prediction (in a real system, we would use more complex modeling)
            predictions = {}
            
            # For each pollutant, predict future values
            for pollutant in POLLUTANTS:
                if pollutant in measurements:
                    current_value = measurements[pollutant]
                    
                    # Add random trend for demonstration (would use actual model in production)
                    trend = np.random.uniform(-0.1, 0.1)
                    
                    # Generate predictions for next 24 hours
                    hourly_predictions = []
                    for i in range(24):
                        # Simple model: current value + trend * hours + small random variation
                        next_value = current_value * (1 + trend * i/24) + np.random.normal(0, 0.05 * current_value)
                        hourly_predictions.append(max(0, round(next_value, 2)))
                    
                    predictions[pollutant] = hourly_predictions
            
            # Calculate predicted AQI based on predicted pollutant values
            aqi_predictions = self._calculate_predicted_aqi(predictions)
            
            return {
                'location': location,
                'timestamp': now.isoformat(),
                'predictions': {
                    'pollutants': predictions,
                    'aqi': aqi_predictions
                }
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            return None
    
    def _calculate_predicted_aqi(self, pollutant_predictions):
        """Calculate AQI from pollutant predictions (simplified version)"""
        aqi_values = []
        
        # For each hour
        for hour in range(24):
            # Get each pollutant's value for this hour
            pm25 = pollutant_predictions.get('pm25', [0] * 24)[hour]
            pm10 = pollutant_predictions.get('pm10', [0] * 24)[hour]
            
            # Simplified AQI calculation primarily based on PM2.5 and PM10
            if pm25 > 55.4:
                aqi = 150 + round(pm25)
                level = 'bad'
            elif pm25 > 35.4:
                aqi = 100 + round((pm25 - 35.4) * 50 / 20)
                level = 'unhealthy'
            elif pm25 > 12:
                aqi = 50 + round((pm25 - 12) * 50 / 23.4)
                level = 'moderate'
            else:
                aqi = round((pm25 / 12) * 50)
                level = 'good'
            
            # Adjust based on PM10 if it would result in a higher AQI
            pm10_aqi = 0
            if pm10 > 254:
                pm10_aqi = 150 + round(pm10 / 2)
            elif pm10 > 154:
                pm10_aqi = 100 + round((pm10 - 154) * 50 / 100)
            elif pm10 > 54:
                pm10_aqi = 50 + round((pm10 - 54) * 50 / 100)
            else:
                pm10_aqi = round((pm10 / 54) * 50)
            
            aqi = max(aqi, pm10_aqi)
            
            # Ensure AQI is between 0 and 500
            aqi = min(500, max(0, aqi))
            
            # Determine level based on final AQI
            if aqi > 300:
                level = 'severe'
            elif aqi > 200:
                level = 'bad'
            elif aqi > 100:
                level = 'unhealthy'
            elif aqi > 50:
                level = 'moderate'
            else:
                level = 'good'
            
            aqi_values.append({'value': aqi, 'level': level})
        
        return aqi_values
            
    def run(self):
        """Main processing loop"""
        logger.info("Starting air quality prediction service")
        
        try:
            for message in self.consumer:
                try:
                    # Get air quality data from Kafka
                    data = message.value
                    logger.info(f"Received data for location: {data.get('location', 'unknown')}")
                    
                    # Generate predictions
                    prediction_result = self.predict_future_aqi(data)
                    
                    if prediction_result:
                        # Send predictions to output topic
                        self.producer.send(OUTPUT_TOPIC, prediction_result)
                        logger.info(f"Sent prediction for {prediction_result['location']}")
                    
                except Exception as e:
                    logger.error(f"Error processing message: {str(e)}")
                    
        except KeyboardInterrupt:
            logger.info("Shutting down")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
        finally:
            logger.info("Closing Kafka connections")
            if self.consumer:
                self.consumer.close()
            if self.producer:
                self.producer.close()

if __name__ == "__main__":
    # Give Kafka time to start
    logger.info("Waiting for Kafka to be ready...")
    time.sleep(20)
    
    predictor = AirQualityPredictor()
    predictor.run()
