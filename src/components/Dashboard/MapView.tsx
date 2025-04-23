
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { AirQualityData } from '@/types/air-quality';
import { getAQIColor } from '@/utils/helpers';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type MapViewProps = {
  data: AirQualityData[];
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
};

// Custom marker icon function
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

const MapView = ({ data, selectedLocation, onLocationSelect }: MapViewProps) => {
  const defaultCenter: [number, number] = [23.0225, 72.5714]; // Ahmedabad coordinates
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  
  // Fix Leaflet marker icons
  useEffect(() => {
    // This code fixes the missing marker icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
    
    // Set map as ready after a delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle map initialization
  const handleMapCreated = (map: L.Map) => {
    setMapInstance(map);
  };
  
  // Update map view when selected location changes
  useEffect(() => {
    if (mapInstance && selectedLocation) {
      const locationData = data.find(item => item.location === selectedLocation);
      if (locationData) {
        mapInstance.setView(locationData.coordinates, 13);
      }
    } else if (mapInstance && data.length > 0) {
      // If no location is selected, fit map to show all points
      const bounds = L.latLngBounds(data.map(item => item.coordinates));
      mapInstance.fitBounds(bounds);
    }
  }, [selectedLocation, data, mapInstance]);
  
  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Monitoring Stations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center h-[400px]">
          <div className="text-center text-gray-500">No location data available</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          <span>Monitoring Stations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        {mapReady && (
          <MapContainer
            center={defaultCenter}
            zoom={11}
            style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}
            whenCreated={handleMapCreated}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onLocationSelect(item.location);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;
