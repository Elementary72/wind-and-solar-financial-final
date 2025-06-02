import { WeatherData, Location } from '../types';

const METEO_API_BASE = 'https://historical-forecast-api.open-meteo.com/v1';

export async function fetchWeatherData(location: Location, startDate: string, endDate: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,direct_normal_irradiance,diffuse_radiation,shortwave_radiation',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
    timezone: 'auto'
  });

  const response = await fetch(`${METEO_API_BASE}/forecast?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

export async function geocodeLocation(query: string): Promise<Location[]> {
  const response = await fetch(`${METEO_API_BASE}/geocoding?name=${encodeURIComponent(query)}&count=5`);
  if (!response.ok) {
    throw new Error('Failed to geocode location');
  }

  return response.json();
}