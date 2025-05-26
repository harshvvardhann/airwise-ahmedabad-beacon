
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

type City = 'ahmedabad' | 'mumbai' | 'delhi' | 'bengaluru' | 'chennai' | 'kolkata';

interface CitySelectorProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
  className?: string;
}

const cities = [
  { value: 'ahmedabad', label: 'Ahmedabad', state: 'Gujarat' },
  { value: 'mumbai', label: 'Mumbai', state: 'Maharashtra' },
  { value: 'delhi', label: 'Delhi', state: 'Delhi' },
  { value: 'bengaluru', label: 'Bengaluru', state: 'Karnataka' },
  { value: 'chennai', label: 'Chennai', state: 'Tamil Nadu' },
  { value: 'kolkata', label: 'Kolkata', state: 'West Bengal' },
];

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCityChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="h-4 w-4 text-primary" />
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-48 bg-card/50 border-border/50">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent className="bg-card border border-border/50">
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
  );
};

export default CitySelector;
export type { City };
