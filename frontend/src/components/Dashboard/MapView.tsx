
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { AirQualityData } from '@/types/air-quality';
import { getAQIColor } from '@/utils/helpers';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// We'll use a div reference approach instead of the MapContainer component
// This avoids context consumer issues with react-leaflet

type MapViewProps = {
  data: AirQualityData[];
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
};

const MapView = ({ data, selectedLocation, onLocationSelect }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize Leaflet map
  useEffect(() => {
    // Fix Leaflet default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mapRef.current && !leafletMapRef.current) {
        // Initialization
        const defaultCenter: [number, number] = [23.0225, 72.5714]; // Ahmedabad coordinates
        const map = L.map(mapRef.current).setView(defaultCenter, 11);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Store map reference
        leafletMapRef.current = map;
        setIsLoading(false);
      }
    }, 300);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);
  
  // Create custom marker icon based on AQI level
  const createMarkerIcon = (level: string) => {
    let colorClass = '';
    
    switch(level) {
      case 'good':
        colorClass = 'bg-green-500';
        break;
      case 'moderate':
        colorClass = 'bg-yellow-500';
        break;
      case 'unhealthy':
        colorClass = 'bg-orange-500';
        break;
      case 'bad':
        colorClass = 'bg-red-500';
        break;
      case 'severe':
        colorClass = 'bg-purple-900';
        break;
      default:
        colorClass = 'bg-gray-300';
    }
    
    const html = `<div class="h-4 w-4 ${colorClass} rounded-full border-2 border-white"></div>`;
    
    return L.divIcon({
      html: html,
      className: 'custom-marker-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };
  
  // Update markers when data changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || isLoading || !data || data.length === 0) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers
    const newMarkers = data.map((item) => {
      const marker = L.marker(item.coordinates, {
        icon: createMarkerIcon(item.level)
      }).addTo(map);
      
      // Add popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      popupContent.innerHTML = `
        <h3 class="font-bold">${item.location}</h3>
        <div class="flex items-center mt-1">
          <div class="h-3 w-3 rounded-full ${getAQIColor(item.level)} mr-2"></div>
          <span class="capitalize">${item.level}</span>
        </div>
        <p class="text-sm mt-1">AQI: <span class="font-bold">${item.aqi}</span></p>
      `;
      
      // Add view details button
      const button = document.createElement('button');
      button.className = 'mt-2 text-xs text-blue-600 hover:text-blue-800 underline';
      button.textContent = 'View Details';
      button.onclick = (e) => {
        e.stopPropagation();
        onLocationSelect(item.location);
      };
      popupContent.appendChild(button);
      
      marker.bindPopup(popupContent);
      
      // Add click handler
      marker.on('click', () => {
        onLocationSelect(item.location);
      });
      
      return marker;
    });
    
    markersRef.current = newMarkers;
    
    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = L.featureGroup(newMarkers).getBounds();
      map.fitBounds(bounds);
    }
  }, [data, isLoading, onLocationSelect]);
  
  // Handle selected location change
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || isLoading) return;
    
    if (selectedLocation) {
      const locationData = data.find(item => item.location === selectedLocation);
      if (locationData) {
        map.setView(locationData.coordinates, 13);
        
        // Find and open popup for the selected location
        markersRef.current.forEach(marker => {
          const popup = marker.getPopup();
          if (popup) {
            const content = popup.getContent();
            if (typeof content === 'string' && content.includes(selectedLocation)) {
              marker.openPopup();
            } else if (content instanceof HTMLElement && content.innerHTML.includes(selectedLocation)) {
              marker.openPopup();
            }
          }
        });
      }
    } else if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(item => item.coordinates));
      map.fitBounds(bounds);
    }
  }, [selectedLocation, data, isLoading]);
  
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
        <div 
          ref={mapRef} 
          className="h-full w-full rounded-b-lg"
          style={{ height: '100%', width: '100%', borderRadius: '0 0 0.5rem 0.5rem' }}
        />
      </CardContent>
    </Card>
  );
};

export default MapView;
