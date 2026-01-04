import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLine, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchPredictions, fetchCurrentAirQuality } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

const Predictions = () => {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);

  // Fetch predictions
  const { data: predictionsData, isLoading: isLoadingPredictions, error: predictionsError } = useQuery({
    queryKey: ['predictions', selectedLocation],
    queryFn: () => fetchPredictions(selectedLocation, 7),
  });

  // Fetch current data for comparison
  const { data: currentData } = useQuery({
    queryKey: ['currentAirQuality'],
    queryFn: fetchCurrentAirQuality,
  });

  // Combine actual and predicted data
  const chartData = React.useMemo(() => {
    if (!predictionsData || !currentData) return [];

    const today = new Date().toISOString().split('T')[0];
    const dataMap = new Map();

    // Add current/actual data
    currentData.forEach((location) => {
      const date = location.timestamp.split('T')[0];
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, actual: location.aqi, predicted: null });
      } else {
        const existing = dataMap.get(date);
        existing.actual = location.aqi;
      }
    });

    // Add predicted data
    predictionsData.forEach((pred) => {
      const date = pred.date;
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, actual: null, predicted: pred.predictedAQI });
      } else {
        const existing = dataMap.get(date);
        existing.predicted = pred.predictedAQI;
      }
    });

    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [predictionsData, currentData]);

  if (isLoadingPredictions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (predictionsError) {
    toast({
      title: 'Error',
      description: 'Failed to load predictions. Please try again.',
      variant: 'destructive',
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <ChartLine className="h-6 w-6 mr-2 text-blue-500" />
        <h1 className="text-3xl font-bold">Air Quality Predictions</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              7-Day AQI Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#2563eb" 
                      name="Actual AQI"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#dc2626" 
                      name="Predicted AQI"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No prediction data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Predictions;
