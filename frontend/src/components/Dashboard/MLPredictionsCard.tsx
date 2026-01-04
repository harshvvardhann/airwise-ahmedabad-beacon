
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, AlertTriangle } from 'lucide-react';

const MLPredictionsCard = () => {
  // Static prediction data
  const predictions = [
    { date: '2025-05-27', predicted_emission: 5.1, day: 'Mon' },
    { date: '2025-05-28', predicted_emission: 5.4, day: 'Tue' },
    { date: '2025-05-29', predicted_emission: 5.8, day: 'Wed' },
    { date: '2025-05-30', predicted_emission: 6.2, day: 'Thu' },
    { date: '2025-05-31', predicted_emission: 5.9, day: 'Fri' },
    { date: '2025-06-01', predicted_emission: 5.6, day: 'Sat' },
    { date: '2025-06-02', predicted_emission: 5.3, day: 'Sun' }
  ];

  const threshold = 5.5; // CO₂ threshold
  const highEmissionDays = predictions.filter(p => p.predicted_emission > threshold);

  return (
    <Card className="eco-card border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          ML Predictions (Next 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert for high emission days */}
        {highEmissionDays.length > 0 && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 font-medium text-sm">High Emission Alert</span>
            </div>
            <p className="text-red-200 text-xs">
              {highEmissionDays.length} day(s) expected to exceed threshold ({threshold} tons)
            </p>
          </div>
        )}

        {/* Mini prediction chart */}
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictions} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                domain={[4, 7]}
              />
              <Tooltip 
                formatter={(value) => [`${value} tons`, 'Predicted CO₂']}
                labelFormatter={(label) => `Day: ${label}`}
                contentStyle={{ 
                  backgroundColor: "rgba(15, 23, 42, 0.95)", 
                  borderColor: "rgba(34, 197, 94, 0.3)",
                  borderRadius: "0.5rem",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(34, 197, 94, 0.3)"
                }}
              />
              {/* Threshold line */}
              <Line
                type="monotone"
                dataKey={() => threshold}
                stroke="#ef4444"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="predicted_emission"
                stroke="#22c55e"
                activeDot={{ r: 5, fill: "#22c55e" }}
                strokeWidth={2}
                dot={(props) => {
                  const isHigh = props.payload.predicted_emission > threshold;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={isHigh ? "#ef4444" : "#22c55e"}
                      stroke={isHigh ? "#ef4444" : "#22c55e"}
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction summary */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-card/50 rounded-lg p-3 border border-border/30">
            <div className="text-lg font-bold text-primary">
              {Math.max(...predictions.map(p => p.predicted_emission)).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Peak Emission</div>
          </div>
          <div className="bg-card/50 rounded-lg p-3 border border-border/30">
            <div className="text-lg font-bold text-primary">
              {(predictions.reduce((sum, p) => sum + p.predicted_emission, 0) / predictions.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Emission</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLPredictionsCard;
