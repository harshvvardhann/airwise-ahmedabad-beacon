
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PollutionChart from './PollutionChart';
import MLPredictionsCard from './MLPredictionsCard';
import EmissionMetricsGrid from './EmissionMetricsGrid';

type CityFilter = 'ahmedabad' | 'mumbai' | 'delhi' | 'bengaluru';

interface RealTimeData {
  aqi: number;
  co2: number;
  temperature: number;
  humidity: number;
  forecastedEmission: number;
  timestamp: string;
}

const RealTimeDashboard = () => {
  const [selectedCity, setSelectedCity] = useState<CityFilter>('ahmedabad');
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Static data for different cities
  const cityData: Record<CityFilter, RealTimeData> = {
    ahmedabad: {
      aqi: 156,
      co2: 4.8,
      temperature: 34,
      humidity: 68,
      forecastedEmission: 5.2,
      timestamp: new Date().toISOString()
    },
    mumbai: {
      aqi: 142,
      co2: 5.1,
      temperature: 32,
      humidity: 75,
      forecastedEmission: 5.5,
      timestamp: new Date().toISOString()
    },
    delhi: {
      aqi: 287,
      co2: 6.4,
      temperature: 28,
      humidity: 72,
      forecastedEmission: 6.8,
      timestamp: new Date().toISOString()
    },
    bengaluru: {
      aqi: 98,
      co2: 3.9,
      temperature: 26,
      humidity: 65,
      forecastedEmission: 4.1,
      timestamp: new Date().toISOString()
    }
  };

  useEffect(() => {
    // Simulate real-time data updates
    const fetchRealTimeData = () => {
      setRealTimeData(cityData[selectedCity]);
      setShowAlert(cityData[selectedCity].co2 > 5.0);
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedCity]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    return 'Unhealthy';
  };

  const cities = [
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bengaluru', label: 'Bengaluru' }
  ];

  if (!realTimeData) return null;

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {showAlert && (
        <Alert className="border-red-500/50 bg-red-950/20 animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <AlertDescription className="text-red-300 font-medium">
            Warning: High CO₂ level detected! Current emission: {realTimeData.co2} tons
          </AlertDescription>
        </Alert>
      )}

      {/* City Filter */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-foreground">City Filter:</h2>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value as CityFilter)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        >
          {cities.map(city => (
            <option key={city.value} value={city.value}>{city.label}</option>
          ))}
        </select>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* AQI Card */}
        <Card className="eco-card border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4 mr-2" />
              Air Quality Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${getAQIColor(realTimeData.aqi)}`}>
                  {realTimeData.aqi}
                </div>
                <p className="text-sm text-muted-foreground">{getAQILevel(realTimeData.aqi)}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${realTimeData.aqi > 150 ? 'bg-red-500' : realTimeData.aqi > 100 ? 'bg-orange-500' : realTimeData.aqi > 50 ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Emission Card */}
        <Card className="eco-card border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Wind className="h-4 w-4 mr-2" />
              CO₂ Emission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {realTimeData.co2}
                </div>
                <p className="text-sm text-muted-foreground">tons</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${realTimeData.co2 > 5 ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Card */}
        <Card className="eco-card border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-400">
                  {realTimeData.temperature}°
                </div>
                <p className="text-sm text-muted-foreground">Celsius</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="eco-card border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Droplets className="h-4 w-4 mr-2" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {realTimeData.humidity}%
                </div>
                <p className="text-sm text-muted-foreground">Relative</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PollutionChart />
        <MLPredictionsCard />
      </div>

      {/* Emission Metrics */}
      <EmissionMetricsGrid forecastedEmission={realTimeData.forecastedEmission} />
    </div>
  );
};

export default RealTimeDashboard;
