
# AirWise Beacon

A comprehensive air quality monitoring and carbon emission tracking system. This full-stack application provides real-time air quality data, predictive analytics, and emission monitoring to help combat air pollution in urban areas.

## 🌟 Features

### Core Functionality

- **Real-time Air Quality Monitoring**: Live data from multiple pollutants (PM2.5, PM10, NO₂, SO₂, CO, O₃)
- **Predictive Analytics**: Machine learning-powered air quality predictions for the next 24 hours
- **Interactive Dashboard**: Modern web interface with maps, charts, and data visualizations
- **Emission Tracking**: Carbon emission monitoring and analysis
- **Alert System**: Automated notifications for poor air quality conditions
- **Historical Data**: Comprehensive historical air quality trends and analysis

### Technical Features

- **Microservices Architecture**: Separated frontend, backend, and ML services
- **Containerized Deployment**: Docker and Kubernetes support for easy scaling
- **Real-time Data Processing**: Kafka-based message streaming
- **Caching**: Redis for performance optimization
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based user authentication and authorization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   ML Service    │
│   (React + TS)  │◄──►│  (Node.js +     │◄──►│   (Python +     │
│                 │    │   Express)      │    │   Scikit-learn) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Databases     │
                    │   • MySQL       │
                    │   • Redis       │
                    │   • Kafka       │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.8+ (for ML service development)
- MySQL 8.0+

### Using Docker Compose (Recommended)

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd airwise-beacon
    ```

2. **Start all services**

    ```bash
    docker-compose up -d
    ```

3. **Access the application**
    - Frontend: http://localhost
    - Backend API: http://localhost:5000
    - phpMyAdmin: http://localhost:8081

### Local Development Setup

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run migrate      # Run database migrations
npm run seed         # Seed initial data
npm run dev          # Start development server
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Start development server on http://localhost:5173
```

#### ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
python app.py        # Start ML prediction service
```

## 📊 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Air Quality Endpoints

- `GET /measurements` - Get air quality measurements
- `GET /measurements/:id` - Get specific measurement
- `POST /measurements` - Create new measurement
- `GET /cities` - Get available cities
- `GET /locations` - Get monitoring locations

### Prediction Endpoints

- `GET /predictions` - Get air quality predictions
- `GET /predictions/:location` - Get predictions for specific location

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=airwise
DB_PASSWORD=airwise_password
DB_NAME=airwise_db
KAFKA_BROKER=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_MAP_API_KEY=your-map-api-key
```

#### ML Service (.env)

```env
KAFKA_BROKER=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🗄️ Database Schema

### Core Tables

- **cities**: City information
- **locations**: Monitoring station locations
- **measurements**: Air quality measurements
- **historical_data**: Historical air quality data
- **air_quality_predictions**: ML predictions
- **notifications**: User notifications
- **users**: User accounts

### Database Migrations

```bash
cd backend
npm run migrate        # Run all migrations
npm run migrate:undo   # Undo last migration
npm run migrate:status # Check migration status
```

## 🤖 Machine Learning Service

### Features

- **Random Forest Regression**: For air quality prediction
- **Real-time Processing**: Kafka-based data streaming
- **AQI Calculation**: Automated Air Quality Index computation
- **Model Persistence**: Joblib-based model storage

### Prediction Model

The ML service predicts air quality for the next 24 hours based on:

- Current pollutant levels
- Historical patterns
- Time-based features (hour, day of week, month)
- Location-specific factors

## 🐳 Docker Deployment

### Individual Services

```bash
# Build and run backend
docker build -t airwise-backend ./backend
docker run -p 5000:5000 airwise-backend

# Build and run frontend
docker build -t airwise-frontend ./frontend
docker run -p 80:80 airwise-frontend

# Build and run ML service
docker build -t airwise-ml ./ml-service
docker run airwise-ml
```

### Kubernetes Deployment

```bash
kubectl apply -f kubernetes/
```

## 📈 Monitoring & Analytics

### Health Checks

- Backend health: `GET /health`
- Database connectivity
- Redis connectivity
- Kafka connectivity

### Logging

- Structured logging with Winston
- Request/response logging with Morgan
- Error tracking and reporting

### Performance Monitoring

- Redis caching for API responses
- Rate limiting with Redis
- Database query optimization

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Express-validator
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📚 Project Structure

```
airwise-beacon/
├── backend/                 # Node.js Express API
│   ├── app/
│   │   ├── db/             # Database models & migrations
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes_controller/  # API routes
│   │   └── services/       # Business logic
│   ├── services/           # External services (Kafka, etc.)
│   └── utils/              # Utility functions
├── frontend/                # React TypeScript app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── ml-service/             # Python ML service
│   ├── app.py              # Main application
│   └── requirements.txt    # Python dependencies
├── kubernetes/             # K8s deployment files
├── docker-compose.yml      # Docker Compose setup
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint and Prettier configurations
- Write comprehensive tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAQ for air quality data APIs
- Contributors and maintainers

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

---

**AirWise Beacon** - Making air cleaner, one breath at a time.
