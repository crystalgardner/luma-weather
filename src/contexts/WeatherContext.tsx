import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { fetchWeatherData } from "@/utils/apiClient";
import { getWeatherIconName } from "@/utils/weatherIconMap";
import { WEATHER_DESCRIPTIONS } from "@/utils/weatherCodes";
import { getCuteWeatherMessage } from "@/utils/weatherMessages";

export interface Location {
  id: string;
  name: string;
  nickname?: string;
  emoji?: string;
  isFavorite?: boolean;
  isDefault?: boolean;
  latitude: number;
  longitude: number;
  region?: string;
  country?: string;
}

export interface WeatherPreferences {
  temperatureUnit: "celsius" | "fahrenheit";
  timeFormat: "12h" | "24h";
  windSpeedUnit: "mph" | "kmh";
  theme: "light" | "dark";
  showFeelsLike: boolean;
  cuteLanguage: boolean;
  notifications: {
    dailyForecast: boolean;
    rainNotifications: boolean;
    dailyTime: string;
  };
  userName: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: "sun" | "cloud" | "moon" | "rain" | "snow" | "thunder";
  precipitation: number; // in mm
  precipitationProbability: number; // percentage
  windSpeed: number;
  windDirection: string; // e.g., "NW", "SE"
  windGusts: number;
  humidity: number;
  cloudCover: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: "sun" | "cloud" | "moon" | "rain" | "snow" | "thunder";
  precipitation: number; // in mm
  precipitationProbability: number; // percentage
  windSpeed: number;
  windDirection: string; // dominant direction
  windGusts: number;
  humidity: number; // calculated from hourly or approximate
  sunrise: string;
  sunset: string;
  description: string;
}



interface WeatherContextType {
  currentLocation: Location;
  setCurrentLocation: (location: Location) => void;

  savedLocations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Preferences
  preferences: WeatherPreferences;
  updatePreferences: (prefs: Partial<WeatherPreferences>) => void;

  updateLocation: (id: string, updates: Partial<Location>) => void;

  currentWeather: {
    temperature: number;
    feelsLike: number;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    precipitationProbability: number;
    windSpeed: number;
    windDirection: string;
    windGusts: number;
    humidity: number;
    cloudCover: number;
    uvIndex: number;
    lastUpdated: string;
  } | null;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];



  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  refreshWeather: () => Promise<void>;
}

import { DEFAULT_LOCATION, DEFAULT_PREFERENCES } from "@/constants/defaults";
import { DAY_NAMES, WIND_DIRECTIONS } from "@/constants/data";

const defaultPreferences: WeatherPreferences = DEFAULT_PREFERENCES;
const defaultLocation: Location = DEFAULT_LOCATION;



const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<Location>(defaultLocation);


  const [savedLocations, setSavedLocations] = useState<Location[]>([defaultLocation]);
  const [preferences, setPreferences] = useState<WeatherPreferences>(defaultPreferences);


  const [currentWeather, setCurrentWeather] = useState<WeatherContextType['currentWeather']>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const addLocation = (location: Location) => {
    setSavedLocations((prev) => [...prev, location]);
  };

  const removeLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setSavedLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
      )
    );
  };

  const updatePreferences = (prefs: Partial<WeatherPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setSavedLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc))
    );
    // Also update current location if it matches
    if (currentLocation.id === id) {
      setCurrentLocation((prev) => ({ ...prev, ...updates }));
    }
  };

  const refreshWeather = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const data = await fetchWeatherData(
        currentLocation.latitude,
        currentLocation.longitude,
        {
          temperatureUnit: preferences.temperatureUnit,
          windSpeedUnit: preferences.windSpeedUnit,
        }
      );

      // --- Current Weather ---
      const current = data.current;
      const daily0 = data.daily;
      const weatherCode = current.weather_code;

      const getWindDirection = (degree: number) => {
        return WIND_DIRECTIONS[Math.round(degree / 45) % 8];
      };

      const now = new Date();
      const currentDesc = WEATHER_DESCRIPTIONS[weatherCode]?.name || "Unknown";

      setCurrentWeather({
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature || current.temperature_2m),
        high: Math.round(daily0.temperature_2m_max[0]),
        low: Math.round(daily0.temperature_2m_min[0]),
        condition: currentDesc,
        precipitation: current.precipitation,
        precipitationProbability: daily0.precipitation_probability_max[0],
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: getWindDirection(current.wind_direction_10m),
        windGusts: Math.round(current.wind_gusts_10m),
        humidity: current.relative_humidity_2m,
        cloudCover: current.cloud_cover,
        uvIndex: 0,
        lastUpdated: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: preferences.timeFormat === "12h"
        }),
      });

      // --- Hourly Forecast ---
      const hourlyData: HourlyForecast[] = [];
      const hourly = data.hourly;

      const currentHourIndex = hourly.time.findIndex((t: string) => new Date(t).getHours() === now.getHours() && new Date(t).getDate() === now.getDate());
      const startIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

      for (let i = 0; i < 24; i++) {
        const idx = startIndex + i;
        if (idx >= hourly.time.length) break;

        const time = hourly.time[idx];
        const hCode = hourly.weather_code[idx];
        const hTime = new Date(time);
        const hIsNight = hTime.getHours() >= 20 || hTime.getHours() < 6;

        hourlyData.push({
          time: hTime.toLocaleTimeString("en-US", { hour: "numeric", hour12: preferences.timeFormat === "12h" }),
          temperature: Math.round(hourly.temperature_2m[idx]),
          feelsLike: Math.round(hourly.temperature_2m[idx]),
          condition: WEATHER_DESCRIPTIONS[hCode]?.name || "",
          icon: getWeatherIconName(hCode, hIsNight),
          precipitation: hourly.precipitation[idx],
          precipitationProbability: hourly.precipitation_probability[idx],
          windSpeed: Math.round(hourly.wind_speed_10m[idx]),
          windDirection: "N",
          windGusts: Math.round(hourly.wind_gusts_10m[idx]),
          humidity: hourly.relative_humidity_2m[idx],
          cloudCover: hourly.cloud_cover[idx],
        });
      }
      setHourlyForecast(hourlyData);


      // --- Daily Forecast ---
      const dailyData: DailyForecast[] = [];
      const daily = data.daily;
      for (let i = 0; i < 7; i++) {
        const dCode = daily.weather_code[i];
        // Append T00:00:00 to force local time parsing (prevents off-by-one error)
        const dDate = new Date(`${daily.time[i]}T00:00:00`);

        // Days array
        let dayName = DAY_NAMES[dDate.getDay()];
        if (i === 0) dayName = "Today";
        if (i === 1) dayName = "Tomorrow";

        dailyData.push({
          date: dDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dayName,
          high: Math.round(daily.temperature_2m_max[i]),
          low: Math.round(daily.temperature_2m_min[i]),
          condition: WEATHER_DESCRIPTIONS[dCode]?.name || "",
          icon: getWeatherIconName(dCode, false),
          precipitation: daily.precipitation_sum[i],
          precipitationProbability: daily.precipitation_probability_max[i],
          windSpeed: Math.round(daily.wind_speed_10m_max[i]),
          windDirection: getWindDirection(daily.wind_direction_10m_dominant[i]),
          windGusts: Math.round(daily.wind_gusts_10m_max[i]),
          humidity: 60,
          sunrise: new Date(daily.sunrise[i]).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: preferences.timeFormat === "12h" }),
          sunset: new Date(daily.sunset[i]).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: preferences.timeFormat === "12h" }),
          description: preferences.cuteLanguage
            ? getCuteWeatherMessage(dCode, false)
            : `Expect ${WEATHER_DESCRIPTIONS[dCode]?.name.toLowerCase()} with a high of ${Math.round(daily.temperature_2m_max[i])}°`,
        });
      }
      setDailyForecast(dailyData);

      setLastUpdated(now);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data");
      setIsLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentLocation, preferences.temperatureUnit, preferences.windSpeedUnit, preferences.timeFormat]);

  // Initial fetch
  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        savedLocations,
        addLocation,
        removeLocation,
        toggleFavorite,
        updateLocation,
        preferences,
        updatePreferences,
        currentWeather,
        hourlyForecast,
        dailyForecast,

        isLoading,
        isRefreshing,
        error,
        lastUpdated,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
