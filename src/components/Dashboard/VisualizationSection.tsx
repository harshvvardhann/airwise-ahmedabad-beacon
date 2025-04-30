
import React from 'react';
import { AirQualityData, AirQualityHistorical, Pollutant } from '@/types/air-quality';
import MapView from '@/components/Dashboard/MapView';
import TrendChart from '@/components/Dashboard/TrendChart';

type VisualizationSectionProps = {
  airQualityData: AirQualityData[];
  historicalData: AirQualityHistorical[] | undefined;
  selectedLocation: string | null;
  selectedPollutant: Pollutant | null;
  onLocationSelect: (location: string) => void;
};

const VisualizationSection = ({
  airQualityData,
  historicalData,
  selectedLocation,
  selectedPollutant,
  onLocationSelect,
}: VisualizationSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <MapView 
        data={airQualityData}
        selectedLocation={selectedLocation}
        onLocationSelect={onLocationSelect}
      />
      {historicalData && (
        <TrendChart 
          data={historicalData}
          selectedPollutant={selectedPollutant}
        />
      )}
    </div>
  );
};

export default VisualizationSection;
