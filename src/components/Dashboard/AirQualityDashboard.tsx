
import React from 'react';
import { AirQualityData, AirQualityHistorical, Pollutant } from '@/types/air-quality';
import DashboardHeader from './DashboardHeader';
import FilterPanel from './FilterPanel';
import AirQualityOverview from './AirQualityOverview';
import VisualizationSection from './VisualizationSection';
import DataTable from './DataTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { LocationData } from '@/types/air-quality';

type AirQualityDashboardProps = {
  airQualityData: AirQualityData[] | undefined;
  historicalData: AirQualityHistorical[] | undefined;
  locationsData: LocationData[] | undefined;
  selectedLocation: string | null;
  selectedPollutant: Pollutant | null;
  isLoadingAirQuality: boolean;
  airQualityError: unknown;
  refetchAirQuality: () => void;
  handleLocationChange: (locationId: string) => void;
  handlePollutantChange: (pollutant: string) => void;
};

const AirQualityDashboard = ({
  airQualityData,
  historicalData,
  locationsData,
  selectedLocation,
  selectedPollutant,
  isLoadingAirQuality,
  airQualityError,
  refetchAirQuality,
  handleLocationChange,
  handlePollutantChange,
}: AirQualityDashboardProps) => {

  // Get the currently selected location data
  const selectedLocationData = selectedLocation && airQualityData 
    ? airQualityData.find(item => item.location === selectedLocation)
    : airQualityData?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <DashboardHeader 
            title="Air Quality Dashboard" 
            subtitle="Real-time air quality monitoring for Ahmedabad" 
          />
          
          <FilterPanel 
            selectedLocation={selectedLocation} 
            selectedPollutant={selectedPollutant}
            locationsData={locationsData}
            onLocationChange={handleLocationChange}
            onPollutantChange={handlePollutantChange}
          />
        </div>
        
        {/* Loading state */}
        {isLoadingAirQuality && <LoadingState />}
        
        {/* Main content when data is loaded */}
        {airQualityData && !isLoadingAirQuality && !airQualityError && (
          <>
            <AirQualityOverview data={selectedLocationData || null} />
            
            <VisualizationSection 
              airQualityData={airQualityData}
              historicalData={historicalData}
              selectedLocation={selectedLocation}
              selectedPollutant={selectedPollutant}
              onLocationSelect={handleLocationChange}
            />
            
            <div className="mb-6">
              <DataTable data={airQualityData} />
            </div>
          </>
        )}
        
        {/* Error state */}
        {airQualityError && !isLoadingAirQuality && (
          <ErrorState onRetry={refetchAirQuality} />
        )}
      </main>
    </div>
  );
};

export default AirQualityDashboard;
