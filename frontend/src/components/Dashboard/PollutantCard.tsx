
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pollutant } from '@/types/air-quality';
import { pollutantInfo } from '@/utils/helpers';

type PollutantCardProps = {
  pollutant: Pollutant;
  value: number | null;
};

const PollutantCard = ({ pollutant, value }: PollutantCardProps) => {
  const info = pollutantInfo[pollutant];
  
  // Function to determine the color based on the pollutant value
  const getColorClass = () => {
    if (value === null) return 'text-foreground/40';
    
    // Different thresholds for different pollutants
    switch (pollutant) {
      case 'pm25':
        if (value <= 12) return 'text-primary';
        if (value <= 35) return 'text-yellow-500';
        if (value <= 55) return 'text-orange-500';
        return 'text-red-500';
      
      case 'pm10':
        if (value <= 54) return 'text-primary';
        if (value <= 154) return 'text-yellow-500';
        if (value <= 254) return 'text-orange-500';
        return 'text-red-500';
        
      case 'no2':
        if (value <= 53) return 'text-primary';
        if (value <= 100) return 'text-yellow-500';
        if (value <= 360) return 'text-orange-500';
        return 'text-red-500';
        
      case 'so2':
        if (value <= 35) return 'text-primary';
        if (value <= 75) return 'text-yellow-500';
        if (value <= 185) return 'text-orange-500';
        return 'text-red-500';
        
      case 'co':
        if (value <= 4.4) return 'text-primary';
        if (value <= 9.4) return 'text-yellow-500';
        if (value <= 12.4) return 'text-orange-500';
        return 'text-red-500';
        
      case 'o3':
        if (value <= 54) return 'text-primary';
        if (value <= 70) return 'text-yellow-500';
        if (value <= 85) return 'text-orange-500';
        return 'text-red-500';
        
      default:
        return 'text-foreground/80';
    }
  };
  
  return (
    <Card className="animate-fade-in border border-border/50 transition-all duration-300 hover:shadow-md overflow-hidden group card-hover">
      <div className="h-1" style={{ backgroundColor: info.color }}></div>
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{info.name}</span>
          <span className="text-xs font-normal text-foreground/50 ml-2">{info.unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex flex-col items-center">
          <div className={`text-3xl font-bold ${getColorClass()} transition-colors duration-300 group-hover:scale-110`}>
            {value === null ? 'N/A' : value}
          </div>
          <p className="mt-1 text-xs text-foreground/60 text-center">{info.fullName}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutantCard;
