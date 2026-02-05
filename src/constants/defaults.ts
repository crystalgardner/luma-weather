import { Location, WeatherPreferences } from "@/contexts/WeatherContext";

export const DEFAULT_LOCATION: Location = {
  id: "1",
  name: "Atlanta, GA",
  emoji: "🍑",
  nickname: "Home",
  isDefault: true,
  isFavorite: true,
  latitude: 33.7490,
  longitude: -84.3880,
  region: "GA",
  country: "USA"
};

export const DEFAULT_PREFERENCES: WeatherPreferences = {
  temperatureUnit: "fahrenheit",
  timeFormat: "12h",
  windSpeedUnit: "mph",
  theme: "light",
  showFeelsLike: true,
  cuteLanguage: true,
  notifications: {
    dailyForecast: true,
    rainNotifications: true,
    dailyTime: "07:00",
  },
  userName: "sunshine", // ☀️
};
