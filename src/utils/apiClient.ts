import { API_CONFIG } from "@/constants/config";

const BASE_URL = API_CONFIG.BASE_URL;

interface WeatherDataOptions {
  timezone?: string;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'mph' | 'ms' | 'kn';
  precipitationUnit?: 'mm' | 'inch';
  forecastDays?: number;
}

/**
 * Fetch weather data from Open-Meteo API
 */
export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  options: WeatherDataOptions = {}
) => {
  const {
    timezone = 'auto',
    temperatureUnit = 'celsius',
    windSpeedUnit = 'kmh',
    precipitationUnit = 'mm',
    forecastDays = 7,
  } = options;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),

    // 'auto' timezone is critical so we get local times for the requested city, 
    // not the user's current browser timezone.
    timezone,

    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    precipitation_unit: precipitationUnit,
    forecast_days: forecastDays.toString(),
    // Hourly variables
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'precipitation',
      'precipitation_probability',
      'cloud_cover',
      'wind_gusts_10m',
    ].join(','),
    // Daily variables
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    // Current weather
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'precipitation',
      'cloud_cover',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
};

/**
 * Geocode location name to coordinates
 */
export const geocodeLocation = async (locationName: string) => {
  const geocodingUrl = API_CONFIG.GEOCODING_URL;

  const params = new URLSearchParams({
    name: locationName,
    count: '5',
    language: 'en',
    format: 'json',
  });

  try {
    const response = await fetch(`${geocodingUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding Error: ${response.status}`);
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.results || []).map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      region: item.admin1 || item.country, // Use admin1 (state/region) or country fallback
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
    }));
  } catch (error) {
    console.error('Failed to geocode location:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to location name
 */
export const reverseGeocodeLocation = async (latitude: number, longitude: number) => {
  const geocodingUrl = API_CONFIG.REVERSE_GEOCODING_URL;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    count: '1',
    language: 'en',
    format: 'json',
  });

  try {
    const response = await fetch(`${geocodingUrl}?${params}`);

    if (!response.ok) {
      throw new Error(`Reverse Geocoding Error: ${response.status}`);
    }

    const data = await response.json();
    const item = data.results?.[0];

    if (!item) return null;

    return {
      id: item.id.toString(),
      name: item.name,
      region: item.admin1 || item.country,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
    };
  } catch (error) {
    console.error('Failed to reverse geocode location:', error);
    throw error;
  }
};
