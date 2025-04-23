
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cron = require('node-cron');
const { sequelize } = require('./models');
const routes = require('./routes');
const { fetchAirQualityData } = require('./services/openaq');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Schedule data fetch every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running scheduled task: Fetching latest air quality data');
    await fetchAirQualityData();
    console.log('Completed scheduled task: Data fetch successful');
  } catch (error) {
    console.error('Scheduled task failed:', error);
  }
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
