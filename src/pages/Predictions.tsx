
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLine, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockPredictionData = [
  { date: '2025-04-28', actual: 65, predicted: 68 },
  { date: '2025-04-29', actual: 70, predicted: 72 },
  { date: '2025-04-30', actual: 75, predicted: 73 },
  { date: '2025-05-01', actual: null, predicted: 78 },
  { date: '2025-05-02', actual: null, predicted: 82 },
  { date: '2025-05-03', actual: null, predicted: 76 },
];

const Predictions = () => {
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
              5-Day AQI Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPredictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Predictions;
