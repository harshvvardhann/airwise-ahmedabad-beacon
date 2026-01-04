
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, Check } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

type City = 'ahmedabad' | 'mumbai' | 'delhi' | 'bengaluru' | 'chennai' | 'kolkata';

interface CitySelectorProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
  className?: string;
  isLoading?: boolean;
  onApply?: () => void;
}

const cities = [
  { value: 'ahmedabad', label: 'Ahmedabad', state: 'Gujarat' },
  { value: 'mumbai', label: 'Mumbai', state: 'Maharashtra' },
  { value: 'delhi', label: 'Delhi', state: 'Delhi' },
  { value: 'bengaluru', label: 'Bengaluru', state: 'Karnataka' },
  { value: 'chennai', label: 'Chennai', state: 'Tamil Nadu' },
  { value: 'kolkata', label: 'Kolkata', state: 'West Bengal' },
];

const CitySelector: React.FC<CitySelectorProps> = ({ 
  selectedCity, 
  onCityChange, 
  className = '', 
  isLoading = false,
  onApply
}) => {
  const [tempSelectedCity, setTempSelectedCity] = useState<City>(selectedCity);
  const [hasChanged, setHasChanged] = useState(false);

  const handleCitySelect = (city: City) => {
    setTempSelectedCity(city);
    setHasChanged(city !== selectedCity);
  };

  const handleApply = () => {
    onCityChange(tempSelectedCity);
    setHasChanged(false);
    if (onApply) {
      onApply();
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <Select value={tempSelectedCity} onValueChange={handleCitySelect} disabled={isLoading}>
          <SelectTrigger className="w-48 bg-card/50 border-border/50">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border/50 z-50">
            {cities.map(city => (
              <SelectItem key={city.value} value={city.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{city.label}</span>
                  <span className="text-xs text-muted-foreground">{city.state}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {hasChanged && !isLoading && (
        <Button 
          onClick={handleApply}
          size="sm" 
          className="bg-primary hover:bg-primary/90"
        >
          <Check className="h-4 w-4 mr-1" />
          Apply
        </Button>
      )}
      
      {isLoading && (
        <LoadingSpinner size="sm" text="Updating..." />
      )}
    </div>
  );
};

export default CitySelector;
export type { City };
