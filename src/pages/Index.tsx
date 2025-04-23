
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import AQICard from '@/components/Dashboard/AQICard';
import PollutantCard from '@/components/Dashboard/PollutantCard';
import MapView from '@/components/Dashboard/MapView';
import TrendChart from '@/components/Dashboard/TrendChart';
import DataTable from '@/components/Dashboard/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { fetchCurrentAirQuality, fetchHistoricalData, fetchLocations } from '@/utils/api';
import { AirQualityData, AirQualityHistorical, LocationData, Pollutant } from '@/types/air-quality';
import { pollutantInfo } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedPollutant, setSelectedPollutant] = useState<Pollutant | null>(null);

  // Fetch current air quality data
  const { 
    data: airQualityData,
    isLoading: isLoadingAirQuality,
    error: airQualityError,
    refetch: refetchAirQuality
  } = useQuery({
    queryKey: ['airQuality'],
    queryFn: fetchCurrentAirQuality,
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch historical data
  const { 
    data: historicalData,
    isLoading: isLoadingHistorical
  } = useQuery({
    queryKey: ['historicalData', selectedLocation, selectedPollutant],
    queryFn: () => fetchHistoricalData(selectedLocation, selectedPollutant, null, null),
  });

  // Fetch locations
  const { 
    data: locationsData,
    isLoading: isLoadingLocations
  } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  // Show error toast if data fetch fails
  useEffect(() => {
    if (airQualityError) {
      toast({
        title: "Error",
        description: "Failed to fetch air quality data. Please try again.",
        variant: "destructive",
      });
    }
  }, [airQualityError, toast]);

  // Get the currently selected location data
  const selectedLocationData = selectedLocation 
    ? airQualityData?.find(item => item.location === selectedLocation)
    : airQualityData?.[0];

  // Handle filter changes
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId === 'all' ? null : locationId);
  };

  const handlePollutantChange = (pollutant: string) => {
    setSelectedPollutant(pollutant === 'all' ? null : pollutant as Pollutant);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Air Quality Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time air quality monitoring for Ahmedabad</p>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Card>
              <CardContent className="p-2">
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <Filter className="h-3 w-3 mr-1" />
                  <span>Location</span>
                </div>
                <Select
                  value={selectedLocation || 'all'}
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locationsData?.map(location => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-2">
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <Filter className="h-3 w-3 mr-1" />
                  <span>Pollutant</span>
                </div>
                <Select
                  value={selectedPollutant || 'all'}
                  onValueChange={handlePollutantChange}
                >
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Select Pollutant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pollutants</SelectItem>
                    {Object.entries(pollutantInfo).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.name} - {info.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoadingAirQuality && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-100 rounded"></div>
            </div>
          </div>
        )}
        
        {/* Main content when data is loaded */}
        {airQualityData && (
          <>
            {/* Top row - AQI and Pollutant cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-1">
                {selectedLocationData && <AQICard data={selectedLocationData} />}
              </div>
              <div className="md:col-span-1 lg:col-span-2">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.keys(pollutantInfo).map((key) => (
                    selectedLocationData && (
                      <PollutantCard
                        key={key}
                        pollutant={key as Pollutant}
                        value={selectedLocationData.measurements[key as Pollutant]}
                      />
                    )
                  ))}
                </div>
              </div>
            </div>
            
            {/* Middle row - Map and Trend chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MapView 
                data={airQualityData}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
              {historicalData && (
                <TrendChart 
                  data={historicalData}
                  selectedPollutant={selectedPollutant}
                />
              )}
            </div>
            
            {/* Bottom row - Data table */}
            <div className="mb-6">
              <DataTable data={airQualityData} />
            </div>
          </>
        )}
        
        {/* Error state */}
        {airQualityError && !isLoadingAirQuality && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-red-500 mb-4 text-center">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold mt-4">Failed to load data</h2>
              <p className="text-gray-600 mt-1">Please try again later or contact support.</p>
            </div>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => refetchAirQuality()}
            >
              Retry
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
