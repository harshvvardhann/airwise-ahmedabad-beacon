
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, MapPin, Check } from 'lucide-react';
import { Pollutant } from '@/types/air-quality';
import { pollutantInfo } from '@/utils/helpers';
import { LocationData } from '@/types/air-quality';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

type FilterPanelProps = {
  selectedLocation: string | null;
  selectedPollutant: Pollutant | null;
  locationsData?: LocationData[];
  onLocationChange: (locationId: string) => void;
  onPollutantChange: (pollutant: string) => void;
  isLoading?: boolean;
  onApplyFilters?: () => void;
};

const FilterPanel = ({
  selectedLocation,
  selectedPollutant,
  locationsData,
  onLocationChange,
  onPollutantChange,
  isLoading = false,
  onApplyFilters
}: FilterPanelProps) => {
  const [tempLocation, setTempLocation] = useState<string | null>(selectedLocation);
  const [tempPollutant, setTempPollutant] = useState<Pollutant | null>(selectedPollutant);
  const [hasChanges, setHasChanges] = useState(false);

  const handleLocationSelect = (locationId: string) => {
    setTempLocation(locationId);
    setHasChanges(locationId !== selectedLocation || tempPollutant !== selectedPollutant);
  };

  const handlePollutantSelect = (pollutant: string) => {
    const pollutantValue = pollutant === 'all' ? null : pollutant as Pollutant;
    setTempPollutant(pollutantValue);
    setHasChanges(tempLocation !== selectedLocation || pollutantValue !== selectedPollutant);
  };

  const handleApply = () => {
    onLocationChange(tempLocation || 'all');
    onPollutantChange(tempPollutant || 'all');
    setHasChanges(false);
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Card className="shadow-sm border-border/70 hover:shadow-md transition-shadow duration-300 bg-card/90">
        <CardContent className="p-3">
          <div className="text-xs text-foreground/60 mb-1 flex items-center font-medium">
            <MapPin className="h-3 w-3 mr-1 text-primary" />
            <span>Location</span>
          </div>
          <Select
            value={tempLocation || 'all'}
            onValueChange={handleLocationSelect}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-9 bg-card border border-border/50">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border/50 z-50">
              <SelectItem value="all" className="font-medium">All Locations</SelectItem>
              {locationsData?.map(location => (
                <SelectItem key={location.id} value={location.name}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-border/70 hover:shadow-md transition-shadow duration-300 bg-card/90">
        <CardContent className="p-3">
          <div className="text-xs text-foreground/60 mb-1 flex items-center font-medium">
            <Filter className="h-3 w-3 mr-1 text-primary" />
            <span>Pollutant</span>
          </div>
          <Select
            value={tempPollutant || 'all'}
            onValueChange={handlePollutantSelect}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-9 bg-card border border-border/50">
              <SelectValue placeholder="Select Pollutant" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border/50 z-50">
              <SelectItem value="all" className="font-medium">All Pollutants</SelectItem>
              {Object.entries(pollutantInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2`} style={{backgroundColor: info.color}}></span>
                    {info.name} - {info.fullName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {hasChanges && !isLoading && (
        <div className="flex items-end">
          <Button 
            onClick={handleApply}
            size="sm" 
            className="bg-primary hover:bg-primary/90 h-9"
          >
            <Check className="h-4 w-4 mr-1" />
            Apply Filters
          </Button>
        </div>
      )}
      
      {isLoading && (
        <div className="flex items-center">
          <LoadingSpinner size="sm" text="Updating..." />
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
