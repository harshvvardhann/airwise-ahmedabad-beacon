
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

type TimeRange = '7days' | '30days';

const PollutionChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

  // Static data for different time ranges
  const chartData = {
    '7days': [
      { date: '2025-05-20', emission: 3.8, day: 'Mon' },
      { date: '2025-05-21', emission: 4.1, day: 'Tue' },
      { date: '2025-05-22', emission: 3.9, day: 'Wed' },
      { date: '2025-05-23', emission: 4.5, day: 'Thu' },
      { date: '2025-05-24', emission: 4.8, day: 'Fri' },
      { date: '2025-05-25', emission: 5.2, day: 'Sat' },
      { date: '2025-05-26', emission: 4.9, day: 'Sun' }
    ],
    '30days': [
      { date: '2025-04-27', emission: 3.2 },
      { date: '2025-05-02', emission: 3.8 },
      { date: '2025-05-07', emission: 4.1 },
      { date: '2025-05-12', emission: 4.5 },
      { date: '2025-05-17', emission: 4.8 },
      { date: '2025-05-22', emission: 5.1 },
      { date: '2025-05-26', emission: 4.9 }
    ]
  };

  return (
    <Card className="eco-card border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Pollution Trend
          </CardTitle>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-1 bg-card border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData[timeRange]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey={timeRange === '7days' ? 'day' : 'date'}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                label={{ 
                  value: 'CO₂ (tons)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' }
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value} tons`, 'CO₂ Emission']}
                labelFormatter={(label) => timeRange === '7days' ? label : `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: "rgba(15, 23, 42, 0.95)", 
                  borderColor: "rgba(34, 197, 94, 0.3)",
                  borderRadius: "0.5rem",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(34, 197, 94, 0.3)"
                }}
              />
              <Line
                type="monotone"
                dataKey="emission"
                stroke="#22c55e"
                activeDot={{ r: 6, fill: "#22c55e" }}
                strokeWidth={3}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutionChart;
