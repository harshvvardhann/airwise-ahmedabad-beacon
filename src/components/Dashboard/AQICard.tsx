
import React from 'react';
import { AirQualityData } from '@/types/air-quality';
import { getAQIColor, getAQIDescription, formatRelativeTime } from '@/utils/helpers';
import { Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AQICardProps = {
  data: AirQualityData;
};

const AQICard = ({ data }: AQICardProps) => {
  return (
    <Card className="overflow-hidden border-2 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className={`h-2 ${getAQIColor(data.level)}`} />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Gauge className="h-5 w-5 mr-2 text-primary" />
          <span>Air Quality Index</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex items-baseline mb-2">
            <div className={`text-6xl font-bold ${data.aqi >= 100 ? 'text-red-600' : data.aqi >= 50 ? 'text-amber-500' : 'text-green-600'}`}>
              {data.aqi}
            </div>
            <div className="text-sm font-medium text-gray-500 ml-2">AQI</div>
          </div>
          <p className={`mt-2 text-center font-medium capitalize px-4 py-1 rounded-full text-white text-sm ${getAQIColor(data.level)}`}>
            {data.level}
          </p>
          <p className="mt-3 text-sm text-gray-500 text-center">
            {getAQIDescription(data.level)}
          </p>
          <div className="mt-4 text-xs text-gray-400 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Updated {formatRelativeTime(data.timestamp)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AQICard;
