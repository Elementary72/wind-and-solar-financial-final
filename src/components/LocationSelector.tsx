import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Map, { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { Location } from '../types';
import { geocodeLocation } from '../services/weatherService';

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewport, setViewport] = useState({
    latitude: -28.4793,
    longitude: 24.6727,
    zoom: 4
  });

  const { data: locations, isLoading } = useQuery(
    ['geocode', searchQuery],
    () => geocodeLocation(searchQuery),
    { enabled: searchQuery.length > 2 }
  );

  const handleLocationSelect = (location: Location) => {
    setViewport({
      ...viewport,
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 10
    });
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search location..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {locations && locations.length > 0 && (
        <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg">
          {locations.map((location, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => handleLocationSelect(location)}
            >
              {location.name}
            </button>
          ))}
        </div>
      )}

      <div className="h-64 rounded-lg overflow-hidden">
        <Map
          {...viewport}
          onMove={evt => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.VITE_MAPBOX_TOKEN}
        >
          <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
          >
            <MapPin className="text-red-500" />
          </Marker>
        </Map>
      </div>
    </div>
  );
};

export default LocationSelector;