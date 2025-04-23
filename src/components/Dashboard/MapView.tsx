
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { AirQualityData } from '@/types/air-quality';
import { getAQIColor } from '@/utils/helpers';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
useEffect(() => {
  // This code fixes the missing marker icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}, []);

type MapViewProps = {
  data: AirQualityData[];
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
};

// Custom marker component
const createMarkerIcon = (level: string) => {
  let colorClass = '';
  
  switch(level) {
    case 'good':
      colorClass = 'bg-aqi-good';
      break;
    case 'moderate':
      colorClass = 'bg-aqi-moderate';
      break;
    case 'unhealthy':
      colorClass = 'bg-aqi-unhealthy';
      break;
    case 'bad':
      colorClass = 'bg-aqi-bad';
      break;
    case 'severe':
      colorClass = 'bg-aqi-severe';
      break;
    default:
      colorClass = 'bg-gray-300';
  }
  
  return L.divIcon({
    html: `<div class="h-4 w-4 ${colorClass} rounded-full border-2 border-white"></div>`,
    className: 'custom-marker-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to automatically center the map when selected location changes
const MapController = ({ 
  data, 
  selectedLocation 
}: { 
  data: AirQualityData[]; 
  selectedLocation: string | null;
}) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (selectedLocation) {
      const locationData = data.find(item => item.location === selectedLocation);
      if (locationData) {
        map.setView(locationData.coordinates, 13);
      }
    } else {
      // If no location is selected, fit map to show all points
      if (data.length > 0) {
        const bounds = L.latLngBounds(data.map(item => item.coordinates));
        map.fitBounds(bounds);
      }
    }
  }, [selectedLocation, data, map]);
  
  return null;
};

const MapView = ({ data, selectedLocation, onLocationSelect }: MapViewProps) => {
  const defaultCenter: [number, number] = [23.0225, 72.5714]; // Ahmedabad coordinates
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          <span>Monitoring Stations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {data.map((item) => (
            <Marker 
              key={item.location}
              position={item.coordinates}
              icon={createMarkerIcon(item.level)}
              eventHandlers={{
                click: () => onLocationSelect(item.location)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{item.location}</h3>
                  <div className="flex items-center mt-1">
                    <div className={`h-3 w-3 rounded-full ${getAQIColor(item.level)} mr-2`}></div>
                    <span className="capitalize">{item.level}</span>
                  </div>
                  <p className="text-sm mt-1">AQI: <span className="font-bold">{item.aqi}</span></p>
                  <button
                    className="mt-2 text-xs text-primary hover:text-primary/80 underline"
                    onClick={() => onLocationSelect(item.location)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapController data={data} selectedLocation={selectedLocation} />
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default MapView;
