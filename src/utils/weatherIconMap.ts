export type WeatherIconType = "sun" | "cloud" | "moon" | "rain" | "snow" | "thunder";

export const getWeatherIconName = (weatherCode: number, isNight: boolean = false): WeatherIconType => {
  // Clear conditions
  if (weatherCode === 0 || weatherCode === 1) {
    return isNight ? "moon" : "sun";
  }

  // Cloudy conditions
  if (weatherCode === 2 || weatherCode === 3) {
    return isNight ? "cloud" : "cloud"; // Could map to moon-cloud if exists, but cloud is safe
  }

  // Fog
  if (weatherCode === 45 || weatherCode === 48) {
    return "cloud";
  }

  // Drizzle
  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return "rain";
  }

  // Rain
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "rain";
  }

  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "snow";
  }

  // Thunderstorm
  if ([95, 96, 99].includes(weatherCode)) {
    return "thunder";
  }

  return isNight ? "moon" : "sun"; // Default
};
