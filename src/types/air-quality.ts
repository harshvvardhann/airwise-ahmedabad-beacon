
// AirQuality types for the application

export type Pollutant = 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3';

export type PollutantInfo = {
  id: Pollutant;
  name: string;
  fullName: string;
  description: string;
  unit: string;
  color: string;
};

export type AirQualityLevel = 'good' | 'moderate' | 'unhealthy' | 'bad' | 'severe';

export type AirQualityData = {
  location: string;
  city: string;
  coordinates: [number, number]; // [latitude, longitude]
  timestamp: string;
  measurements: Record<Pollutant, number | null>;
  aqi: number;
  level: AirQualityLevel;
};

export type AirQualityHistorical = {
  date: string;
  measurements: Record<Pollutant, number | null>;
};

export type LocationData = {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number];
};

export type FilterOptions = {
  location: string | null;
  pollutant: Pollutant | null;
  dateRange: [Date | null, Date | null];
};
