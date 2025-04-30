
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { Pollutant } from '@/types/air-quality';
import { pollutantInfo } from '@/utils/helpers';
import { LocationData } from '@/types/air-quality';

type FilterPanelProps = {
  selectedLocation: string | null;
  selectedPollutant: Pollutant | null;
  locationsData?: LocationData[];
  onLocationChange: (locationId: string) => void;
  onPollutantChange: (pollutant: string) => void;
};

const FilterPanel = ({
  selectedLocation,
  selectedPollutant,
  locationsData,
  onLocationChange,
  onPollutantChange,
}: FilterPanelProps) => {
  return (
    <div className="flex space-x-4 mt-4 md:mt-0">
      <Card>
        <CardContent className="p-2">
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            <span>Location</span>
          </div>
          <Select
            value={selectedLocation || 'all'}
            onValueChange={onLocationChange}
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
            onValueChange={onPollutantChange}
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
  );
};

export default FilterPanel;
