
import { AirQualityLevel, Pollutant, PollutantInfo } from "@/types/air-quality";

// Pollutant information
export const pollutantInfo: Record<Pollutant, PollutantInfo> = {
  pm25: {
    id: "pm25",
    name: "PM2.5",
    fullName: "Fine Particulate Matter",
    description: "Particles with a diameter of 2.5 micrometers or less. They can penetrate deep into the lungs and even enter the bloodstream.",
    unit: "μg/m³",
    color: "#F44336", // Red
  },
  pm10: {
    id: "pm10",
    name: "PM10",
    fullName: "Particulate Matter",
    description: "Particles with a diameter of 10 micrometers or less that can be inhaled into the respiratory system.",
    unit: "μg/m³",
    color: "#FF9800", // Orange
  },
  no2: {
    id: "no2",
    name: "NO₂",
    fullName: "Nitrogen Dioxide",
    description: "Gaseous air pollutant composed of nitrogen and oxygen that can cause respiratory issues and contribute to acid rain.",
    unit: "ppb",
    color: "#FFC107", // Amber
  },
  so2: {
    id: "so2",
    name: "SO₂",
    fullName: "Sulfur Dioxide",
    description: "Toxic gas with a strong odor that is produced when sulfur-containing fuels are burned.",
    unit: "ppb",
    color: "#9C27B0", // Purple
  },
  co: {
    id: "co",
    name: "CO",
    fullName: "Carbon Monoxide",
    description: "Odorless, colorless gas that can be harmful when inhaled in large amounts, reducing oxygen delivery to organs.",
    unit: "ppm",
    color: "#795548", // Brown
  },
  o3: {
    id: "o3",
    name: "O₃",
    fullName: "Ozone",
    description: "Reactive gas composed of three oxygen atoms that can trigger health problems at ground level.",
    unit: "ppb",
    color: "#2196F3", // Blue
  },
};

// Format date to local string
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format timestamp to relative time (e.g., "5 minutes ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
}

// Get AQI level color
export function getAQIColor(level: AirQualityLevel): string {
  switch (level) {
    case 'good':
      return 'bg-aqi-good';
    case 'moderate':
      return 'bg-aqi-moderate';
    case 'unhealthy':
      return 'bg-aqi-unhealthy';
    case 'bad':
      return 'bg-aqi-bad';
    case 'severe':
      return 'bg-aqi-severe';
    default:
      return 'bg-gray-300';
  }
}

// Get textual description for AQI levels
export function getAQIDescription(level: AirQualityLevel): string {
  switch (level) {
    case 'good':
      return 'Good air quality. Enjoy outdoor activities!';
    case 'moderate':
      return 'Moderate air quality. Consider reducing prolonged outdoor activities if sensitive.';
    case 'unhealthy':
      return 'Unhealthy air quality. Reduce outdoor activities, especially if you have respiratory issues.';
    case 'bad':
      return 'Bad air quality. Avoid outdoor activities. Keep windows closed.';
    case 'severe':
      return 'Severe air quality. Stay indoors and use air purifiers if available.';
    default:
      return 'No data available';
  }
}

// Get AQI level from value
export function getAQILevel(value: number): AirQualityLevel {
  if (value <= 50) return 'good';
  if (value <= 100) return 'moderate';
  if (value <= 150) return 'unhealthy';
  if (value <= 200) return 'bad';
  return 'severe';
}
