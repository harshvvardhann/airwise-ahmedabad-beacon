
// AQI Calculation utilities based on EPA standards

// AQI Breakpoints for different pollutants
const AQI_BREAKPOINTS = {
  'pm25': [
    { cLow: 0.0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, aqiLow: 301, aqiHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, aqiLow: 401, aqiHigh: 500 }
  ],
  'pm10': [
    { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
    { cLow: 55, cHigh: 154, aqiLow: 51, aqiHigh: 100 },
    { cLow: 155, cHigh: 254, aqiLow: 101, aqiHigh: 150 },
    { cLow: 255, cHigh: 354, aqiLow: 151, aqiHigh: 200 },
    { cLow: 355, cHigh: 424, aqiLow: 201, aqiHigh: 300 },
    { cLow: 425, cHigh: 504, aqiLow: 301, aqiHigh: 400 },
    { cLow: 505, cHigh: 604, aqiLow: 401, aqiHigh: 500 }
  ],
  'no2': [
    { cLow: 0, cHigh: 53, aqiLow: 0, aqiHigh: 50 },
    { cLow: 54, cHigh: 100, aqiLow: 51, aqiHigh: 100 },
    { cLow: 101, cHigh: 360, aqiLow: 101, aqiHigh: 150 },
    { cLow: 361, cHigh: 649, aqiLow: 151, aqiHigh: 200 },
    { cLow: 650, cHigh: 1249, aqiLow: 201, aqiHigh: 300 },
    { cLow: 1250, cHigh: 1649, aqiLow: 301, aqiHigh: 400 },
    { cLow: 1650, cHigh: 2049, aqiLow: 401, aqiHigh: 500 }
  ],
  'so2': [
    { cLow: 0, cHigh: 35, aqiLow: 0, aqiHigh: 50 },
    { cLow: 36, cHigh: 75, aqiLow: 51, aqiHigh: 100 },
    { cLow: 76, cHigh: 185, aqiLow: 101, aqiHigh: 150 },
    { cLow: 186, cHigh: 304, aqiLow: 151, aqiHigh: 200 },
    { cLow: 305, cHigh: 604, aqiLow: 201, aqiHigh: 300 },
    { cLow: 605, cHigh: 804, aqiLow: 301, aqiHigh: 400 },
    { cLow: 805, cHigh: 1004, aqiLow: 401, aqiHigh: 500 }
  ],
  'co': [
    { cLow: 0.0, cHigh: 4.4, aqiLow: 0, aqiHigh: 50 },
    { cLow: 4.5, cHigh: 9.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 9.5, cHigh: 12.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 12.5, cHigh: 15.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 15.5, cHigh: 30.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 30.5, cHigh: 40.4, aqiLow: 301, aqiHigh: 400 },
    { cLow: 40.5, cHigh: 50.4, aqiLow: 401, aqiHigh: 500 }
  ],
  'o3': [
    { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
    { cLow: 55, cHigh: 70, aqiLow: 51, aqiHigh: 100 },
    { cLow: 71, cHigh: 85, aqiLow: 101, aqiHigh: 150 },
    { cLow: 86, cHigh: 105, aqiLow: 151, aqiHigh: 200 },
    { cLow: 106, cHigh: 200, aqiLow: 201, aqiHigh: 300 },
    { cLow: 201, cHigh: 300, aqiLow: 301, aqiHigh: 400 },
    { cLow: 301, cHigh: 400, aqiLow: 401, aqiHigh: 500 }
  ]
};

// Calculate AQI for a given concentration and pollutant
function calculateAQI(concentration, pollutant) {
  if (concentration === null || concentration === undefined || isNaN(concentration)) {
    return null;
  }
  
  const pollutantKey = pollutant.toLowerCase();
  const breakpoints = AQI_BREAKPOINTS[pollutantKey];
  
  if (!breakpoints) {
    console.warn(`No AQI breakpoints found for pollutant: ${pollutant}`);
    return null;
  }
  
  // Find the appropriate breakpoint
  let breakpoint = null;
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      breakpoint = bp;
      break;
    }
  }
  
  // If concentration is higher than highest breakpoint, use the highest
  if (!breakpoint && concentration > breakpoints[breakpoints.length - 1].cHigh) {
    breakpoint = breakpoints[breakpoints.length - 1];
  }
  
  // If concentration is lower than lowest breakpoint, use the lowest
  if (!breakpoint && concentration < breakpoints[0].cLow) {
    breakpoint = breakpoints[0];
  }
  
  if (!breakpoint) {
    console.warn(`No appropriate breakpoint found for ${pollutant}: ${concentration}`);
    return null;
  }
  
  // Calculate AQI using EPA formula
  // AQI = ((IHi - ILo) / (BPHi - BPLo)) * (Cp - BPLo) + ILo
  const aqi = Math.round(
    ((breakpoint.aqiHigh - breakpoint.aqiLow) / (breakpoint.cHigh - breakpoint.cLow)) *
    (concentration - breakpoint.cLow) + breakpoint.aqiLow
  );
  
  return Math.max(0, Math.min(500, aqi)); // Clamp between 0 and 500
}

// Get AQI level category
function getAQILevel(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return null;
  }
  
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  if (aqi <= 200) return 'bad';
  return 'severe';
}

// Get AQI color for display
function getAQIColor(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return '#gray';
  }
  
  if (aqi <= 50) return '#00e400'; // Green
  if (aqi <= 100) return '#ffff00'; // Yellow
  if (aqi <= 150) return '#ff7e00'; // Orange
  if (aqi <= 200) return '#ff0000'; // Red
  if (aqi <= 300) return '#8f3f97'; // Purple
  return '#7e0023'; // Maroon
}

// Get AQI description
function getAQIDescription(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return 'No data available';
  }
  
  if (aqi <= 50) return 'Good - Air quality is considered satisfactory';
  if (aqi <= 100) return 'Moderate - Air quality is acceptable for most people';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups - Members of sensitive groups may experience health effects';
  if (aqi <= 200) return 'Unhealthy - Everyone may begin to experience health effects';
  if (aqi <= 300) return 'Very Unhealthy - Health warnings of emergency conditions';
  return 'Hazardous - Health alert: everyone may experience more serious health effects';
}

// Calculate composite AQI from multiple pollutants
function calculateCompositeAQI(measurements) {
  if (!measurements || measurements.length === 0) {
    return null;
  }
  
  const aqiValues = measurements
    .map(m => calculateAQI(m.value, m.pollutant))
    .filter(aqi => aqi !== null && !isNaN(aqi));
  
  if (aqiValues.length === 0) {
    return null;
  }
  
  // Return the highest AQI value (most restrictive)
  return Math.max(...aqiValues);
}

module.exports = {
  calculateAQI,
  getAQILevel,
  getAQIColor,
  getAQIDescription,
  calculateCompositeAQI,
  AQI_BREAKPOINTS
};
