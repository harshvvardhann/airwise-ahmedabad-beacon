import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PollutionChart from './PollutionChart';
import MLPredictionsCard from './MLPredictionsCard';
import EmissionMetricsGrid from './EmissionMetricsGrid';
import CitySelector, { City } from '@/components/Common/CitySelector';
import LastUpdated from '@/components/Common/LastUpdated';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface RealTimeData {
  aqi: number;
  co2: number;
  temperature: number;
  humidity: number;
  forecastedEmission: number;
  timestamp: string;
}

const RealTimeDashboard = () => {
  const [selectedCity, setSelectedCity] = useState<City>('ahmedabad');
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Static data for different cities
  const cityData: Record<City, RealTimeData> = {
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
    },
    chennai: {
      aqi: 134,
      co2: 4.6,
      temperature: 31,
      humidity: 73,
      forecastedEmission: 4.9,
      timestamp: new Date().toISOString()
    },
    kolkata: {
      aqi: 167,
      co2: 5.3,
      temperature: 29,
      humidity: 78,
      forecastedEmission: 5.6,
      timestamp: new Date().toISOString()
    }
  };

  const fetchRealTimeData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const baseData = cityData[selectedCity];
      const updatedData = {
        ...baseData,
        aqi: baseData.aqi + Math.floor(Math.random() * 10) - 5,
        co2: baseData.co2 + (Math.random() * 0.4) - 0.2,
        temperature: baseData.temperature + Math.floor(Math.random() * 4) - 2,
        humidity: baseData.humidity + Math.floor(Math.random() * 6) - 3,
        timestamp: new Date().toISOString()
      };
      
      setRealTimeData(updatedData);
      setShowAlert(updatedData.co2 > 5.0);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
  };

  useEffect(() => {
    fetchRealTimeData();
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(fetchRealTimeData, 300000); // Update every 5 minutes
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

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading real-time dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with City Selector and Last Updated */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Real-Time Monitor</h2>
          <CitySelector 
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            isLoading={isLoading}
            onApply={fetchRealTimeData}
          />
        </div>
        <LastUpdated 
          lastUpdate={lastUpdate}
          onRefresh={fetchRealTimeData}
          autoRefresh={true}
          refreshInterval={300000}
          isLoading={isLoading}
        />
      </div>

      {/* Alert Banner */}
      {showAlert && realTimeData && (
        <Alert className="border-red-500/50 bg-red-950/20 animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <AlertDescription className="text-red-300 font-medium">
            Warning: High CO₂ level detected! Current emission: {realTimeData.co2.toFixed(1)} tons
          </AlertDescription>
        </Alert>
      )}

      {/* Real-Time Metrics Grid */}
      {isLoading && !realTimeData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="eco-card border-border/50">
              <CardContent className="p-6">
                <LoadingSpinner size="md" text="Loading..." />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : realTimeData && (
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
                    {realTimeData.co2.toFixed(1)}
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
      )}

      {/* Charts and Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PollutionChart />
        <MLPredictionsCard />
      </div>

      {/* Emission Metrics */}
      {realTimeData && <EmissionMetricsGrid forecastedEmission={realTimeData.forecastedEmission} />}
    </div>
  );
};

export default RealTimeDashboard;
