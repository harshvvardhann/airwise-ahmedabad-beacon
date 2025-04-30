
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, MapPin, ChevronDown } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 md:mt-0">
      <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-3">
          <div className="text-xs text-gray-500 mb-1 flex items-center font-medium">
            <MapPin className="h-3 w-3 mr-1 text-primary" />
            <span>Location</span>
          </div>
          <Select
            value={selectedLocation || 'all'}
            onValueChange={onLocationChange}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-9 bg-white border border-gray-200">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
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
      
      <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-3">
          <div className="text-xs text-gray-500 mb-1 flex items-center font-medium">
            <Filter className="h-3 w-3 mr-1 text-primary" />
            <span>Pollutant</span>
          </div>
          <Select
            value={selectedPollutant || 'all'}
            onValueChange={onPollutantChange}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-9 bg-white border border-gray-200">
              <SelectValue placeholder="Select Pollutant" />
            </SelectTrigger>
            <SelectContent>
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
    </div>
  );
};

export default FilterPanel;
