
import React from 'react';
import { AirQualityData, AirQualityHistorical, Pollutant } from '@/types/air-quality';
import DashboardHeader from './DashboardHeader';
import FilterPanel from './FilterPanel';
import AirQualityOverview from './AirQualityOverview';
import VisualizationSection from './VisualizationSection';
import DataTable from './DataTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import RealTimeDashboard from './RealTimeDashboard';
import { LocationData } from '@/types/air-quality';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="eco-card rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <DashboardHeader 
              title="AirWise Dashboard" 
              subtitle="Real-time air quality & emission monitoring" 
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoadingAirQuality && <LoadingState />}
        
        {/* Error state */}
        {airQualityError && !isLoadingAirQuality && (
          <ErrorState onRetry={refetchAirQuality} />
        )}

        {/* Main dashboard content */}
        {!isLoadingAirQuality && !airQualityError && (
          <Tabs defaultValue="realtime" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50 border border-border/50">
              <TabsTrigger 
                value="realtime" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Real-Time Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="airquality"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Air Quality Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="space-y-6">
              <RealTimeDashboard />
            </TabsContent>

            <TabsContent value="airquality" className="space-y-6">
              <div className="eco-card rounded-xl shadow-md p-6 mb-6">
                <FilterPanel 
                  selectedLocation={selectedLocation} 
                  selectedPollutant={selectedPollutant}
                  locationsData={locationsData}
                  onLocationChange={handleLocationChange}
                  onPollutantChange={handlePollutantChange}
                />
              </div>

              {airQualityData && (
                <>
                  <AirQualityOverview data={selectedLocationData || null} />
                  
                  <VisualizationSection 
                    airQualityData={airQualityData}
                    historicalData={historicalData}
                    selectedLocation={selectedLocation}
                    selectedPollutant={selectedPollutant}
                    onLocationSelect={handleLocationChange}
                  />
                  
                  <div className="eco-card rounded-xl shadow-md p-6 mb-6">
                    <DataTable data={airQualityData} />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AirQualityDashboard;
