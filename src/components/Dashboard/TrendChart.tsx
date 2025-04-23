
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import { AirQualityHistorical, Pollutant } from '@/types/air-quality';
import { pollutantInfo } from '@/utils/helpers';

type TrendChartProps = {
  data: AirQualityHistorical[];
  selectedPollutant: Pollutant | null;
};

const TrendChart = ({ data, selectedPollutant }: TrendChartProps) => {
  // Prepare data for the chart
  const chartData = data.map(item => {
    const values: Record<string, any> = {
      date: item.date
    };
    
    Object.entries(item.measurements).forEach(([pollutant, value]) => {
      if (value !== null) {
        values[pollutant] = value;
      }
    });
    
    return values;
  });
  
  // Determine which pollutants to display based on selection
  const pollutantsToShow: Pollutant[] = selectedPollutant 
    ? [selectedPollutant] 
    : ['pm25', 'pm10', 'no2', 'o3'];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <LineChartIcon className="h-5 w-5 mr-2" />
          <span>Pollutant Trends</span>
          {selectedPollutant && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              - {pollutantInfo[selectedPollutant].name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                const pollutant = name as Pollutant;
                return [`${value} ${pollutantInfo[pollutant]?.unit || ''}`, pollutantInfo[pollutant]?.name || name];
              }}
            />
            <Legend />
            {pollutantsToShow.map(pollutant => (
              <Line
                key={pollutant}
                type="monotone"
                dataKey={pollutant}
                name={pollutantInfo[pollutant].name}
                stroke={pollutantInfo[pollutant].color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
