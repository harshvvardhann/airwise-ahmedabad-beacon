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

// Function to fetch carbon emissions data
export async function fetchCarbonEmissionsData(): Promise<any> {
  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock carbon emissions data
    return getMockCarbonEmissionsData();
  } catch (error) {
    console.error("Error fetching carbon emissions data:", error);
    throw new Error("Failed to fetch carbon emissions data");
  }
}

// Function to fetch carbon reduction strategies
export async function fetchCarbonReductionStrategies(): Promise<any> {
  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock carbon reduction strategies
    return getMockCarbonReductionStrategies();
  } catch (error) {
    console.error("Error fetching carbon reduction strategies:", error);
    throw new Error("Failed to fetch carbon reduction strategies");
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

// Mock data for carbon emissions
function getMockCarbonEmissionsData() {
  return {
    totalEmissions: {
      current: 970,
      previous: 905,
      change: 7.3
    },
    byScope: {
      scope1: 170,
      scope2: 280,
      scope3: 520
    },
    monthlyData: [
      { month: 'Jan', scope1: 120, scope2: 240, scope3: 450, total: 810 },
      { month: 'Feb', scope1: 110, scope2: 220, scope3: 430, total: 760 },
      { month: 'Mar', scope1: 140, scope2: 250, scope3: 470, total: 860 },
      { month: 'Apr', scope1: 130, scope2: 230, scope3: 440, total: 800 },
      { month: 'May', scope1: 150, scope2: 260, scope3: 490, total: 900 },
      { month: 'Jun', scope1: 170, scope2: 280, scope3: 520, total: 970 }
    ],
    forecast: [
      { month: 'Jul', predicted: 950, target: 900 },
      { month: 'Aug', predicted: 930, target: 880 },
      { month: 'Sep', predicted: 910, target: 860 },
      { month: 'Oct', predicted: 890, target: 840 },
      { month: 'Nov', predicted: 870, target: 820 },
      { month: 'Dec', predicted: 850, target: 800 }
    ]
  };
}

// Mock data for carbon reduction strategies
function getMockCarbonReductionStrategies() {
  return {
    recommendations: {
      scope1And2: [
        "Switch to renewable energy sources for office operations",
        "Upgrade to energy-efficient equipment and lighting",
        "Transition company vehicles to electric or hybrid models",
        "Install smart building management systems"
      ],
      scope3: [
        "Implement a sustainable procurement policy",
        "Engage suppliers on their carbon reduction efforts",
        "Reduce business travel and promote virtual meetings",
        "Optimize logistics and transportation routes"
      ]
    },
    roadmap: {
      shortTerm: {
        timeframe: "0-6 months",
        targetReduction: "5-10%"
      },
      mediumTerm: {
        timeframe: "6-18 months",
        targetReduction: "15-25%"
      },
      longTerm: {
        timeframe: "18-36 months",
        targetReduction: "30-45%"
      }
    },
    carbonIntensity: {
      electricity: 0.41, // per kWh
      naturalGas: 0.18, // per kWh
      petrol: 2.31, // per liter
      diesel: 2.68, // per liter
      flight: 0.25, // per km (economy)
      beef: 27, // per kg
      lamb: 39, // per kg
      cheese: 13.5, // per kg
      milk: 1.9, // per liter
      vegetables: 2, // per kg
      fruit: 1.1, // per kg
    }
  };
}
