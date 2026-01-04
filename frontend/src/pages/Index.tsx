
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pollutant } from '@/types/air-quality';
import { fetchCurrentAirQuality, fetchHistoricalData, fetchLocations } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import AirQualityDashboard from '@/components/Dashboard/AirQualityDashboard';

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

  // Handle filter changes
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId === 'all' ? null : locationId);
  };

  const handlePollutantChange = (pollutant: string) => {
    setSelectedPollutant(pollutant === 'all' ? null : pollutant as Pollutant);
  };

  return (
    <AirQualityDashboard
      airQualityData={airQualityData}
      historicalData={historicalData}
      locationsData={locationsData}
      selectedLocation={selectedLocation}
      selectedPollutant={selectedPollutant}
      isLoadingAirQuality={isLoadingAirQuality}
      airQualityError={airQualityError}
      refetchAirQuality={refetchAirQuality}
      handleLocationChange={handleLocationChange}
      handlePollutantChange={handlePollutantChange}
    />
  );
};

export default Index;
