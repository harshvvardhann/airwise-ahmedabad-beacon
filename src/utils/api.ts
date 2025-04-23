
import { AirQualityData, AirQualityHistorical, LocationData, Pollutant } from "@/types/air-quality";

// OpenAQ API base URL
const API_BASE_URL = "https://api.openaq.org/v2";

// Function to fetch current air quality data for Ahmedabad
export async function fetchCurrentAirQuality(): Promise<AirQualityData[]> {
  try {
    // In a real implementation, we would call the actual OpenAQ API
    // For now, we'll return mock data with a delay to simulate API fetch
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return getMockAirQualityData();
  } catch (error) {
    console.error("Error fetching current air quality:", error);
    throw new Error("Failed to fetch current air quality data");
  }
}

// Function to fetch historical data
export async function fetchHistoricalData(
  location: string | null, 
  pollutant: Pollutant | null,
  dateFrom: Date | null,
  dateTo: Date | null
): Promise<AirQualityHistorical[]> {
  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return getMockHistoricalData();
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw new Error("Failed to fetch historical air quality data");
  }
}

// Function to fetch available locations in Ahmedabad
export async function fetchLocations(): Promise<LocationData[]> {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: "ahmedabad-1", name: "Maninagar", city: "Ahmedabad", coordinates: [23.0225, 72.5714] },
      { id: "ahmedabad-2", name: "Satellite", city: "Ahmedabad", coordinates: [23.0276, 72.5295] },
      { id: "ahmedabad-3", name: "Navrangpura", city: "Ahmedabad", coordinates: [23.0413, 72.5559] },
      { id: "ahmedabad-4", name: "GIFT City", city: "Ahmedabad", coordinates: [23.1607, 72.6815] },
      { id: "ahmedabad-5", name: "Bopal", city: "Ahmedabad", coordinates: [23.0368, 72.4625] },
    ];
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw new Error("Failed to fetch location data");
  }
}

// Mock data for development
function getMockAirQualityData(): AirQualityData[] {
  return [
    {
      location: "Maninagar",
      city: "Ahmedabad",
      coordinates: [23.0225, 72.5714],
      timestamp: new Date().toISOString(),
      measurements: {
        pm25: 45,
        pm10: 82,
        no2: 24,
        so2: 18,
        co: 0.8,
        o3: 52
      },
      aqi: 95,
      level: "moderate"
    },
    {
      location: "Satellite",
      city: "Ahmedabad",
      coordinates: [23.0276, 72.5295],
      timestamp: new Date().toISOString(),
      measurements: {
        pm25: 28,
        pm10: 56,
        no2: 18,
        so2: 12,
        co: 0.5,
        o3: 38
      },
      aqi: 65,
      level: "moderate"
    },
    {
      location: "Navrangpura",
      city: "Ahmedabad",
      coordinates: [23.0413, 72.5559],
      timestamp: new Date().toISOString(),
      measurements: {
        pm25: 18,
        pm10: 42,
        no2: 15,
        so2: 8,
        co: 0.4,
        o3: 32
      },
      aqi: 45,
      level: "good"
    },
    {
      location: "GIFT City",
      city: "Ahmedabad",
      coordinates: [23.1607, 72.6815],
      timestamp: new Date().toISOString(),
      measurements: {
        pm25: 65,
        pm10: 105,
        no2: 35,
        so2: 22,
        co: 1.2,
        o3: 60
      },
      aqi: 140,
      level: "unhealthy"
    },
    {
      location: "Bopal",
      city: "Ahmedabad",
      coordinates: [23.0368, 72.4625],
      timestamp: new Date().toISOString(),
      measurements: {
        pm25: 36,
        pm10: 68,
        no2: 22,
        so2: 15,
        co: 0.7,
        o3: 45
      },
      aqi: 85,
      level: "moderate"
    }
  ];
}

function getMockHistoricalData(): AirQualityHistorical[] {
  const data: AirQualityHistorical[] = [];
  
  // Generate data for the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      measurements: {
        pm25: 20 + Math.round(Math.random() * 40),
        pm10: 40 + Math.round(Math.random() * 50),
        no2: 10 + Math.round(Math.random() * 30),
        so2: 5 + Math.round(Math.random() * 20),
        co: 0.3 + Math.random() * 1.2,
        o3: 30 + Math.round(Math.random() * 40)
      }
    });
  }
  
  return data;
}
