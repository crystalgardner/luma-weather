// WMO Weather Code Reference
export const WEATHER_CODES = {
  // Clear conditions
  CLEAR_SKY: 0,
  MAINLY_CLEAR: 1,
  PARTLY_CLOUDY: 2,
  OVERCAST: 3,

  // Fog
  FOG: 45,
  RIME_FOG: 48,

  // Drizzle
  LIGHT_DRIZZLE: 51,
  MODERATE_DRIZZLE: 53,
  DENSE_DRIZZLE: 55,

  // Freezing drizzle
  LIGHT_FREEZING_DRIZZLE: 56,
  DENSE_FREEZING_DRIZZLE: 57,

  // Rain
  SLIGHT_RAIN: 61,
  MODERATE_RAIN: 63,
  HEAVY_RAIN: 65,

  // Freezing rain
  LIGHT_FREEZING_RAIN: 66,
  HEAVY_FREEZING_RAIN: 67,

  // Snow
  SLIGHT_SNOW: 71,
  MODERATE_SNOW: 73,
  HEAVY_SNOW: 75,
  SNOW_GRAINS: 77,

  // Showers
  SLIGHT_RAIN_SHOWERS: 80,
  MODERATE_RAIN_SHOWERS: 81,
  VIOLENT_RAIN_SHOWERS: 82,
  SLIGHT_SNOW_SHOWERS: 85,
  HEAVY_SNOW_SHOWERS: 86,

  // Thunderstorm
  THUNDERSTORM: 95,
  THUNDERSTORM_WITH_HAIL: 96,
  THUNDERSTORM_WITH_HEAVY_HAIL: 99,
};

export const WEATHER_DESCRIPTIONS: Record<number, { name: string; severity: 'good' | 'neutral' | 'caution' | 'warning' | 'danger' }> = {
  0: { name: 'Clear Sky', severity: 'good' },
  1: { name: 'Mainly Clear', severity: 'good' },
  2: { name: 'Partly Cloudy', severity: 'good' },
  3: { name: 'Overcast', severity: 'neutral' },
  45: { name: 'Fog', severity: 'caution' },
  48: { name: 'Depositing Rime Fog', severity: 'caution' },
  51: { name: 'Light Drizzle', severity: 'caution' },
  53: { name: 'Moderate Drizzle', severity: 'caution' },
  55: { name: 'Dense Drizzle', severity: 'caution' },
  56: { name: 'Light Freezing Drizzle', severity: 'warning' },
  57: { name: 'Dense Freezing Drizzle', severity: 'warning' },
  61: { name: 'Slight Rain', severity: 'caution' },
  63: { name: 'Moderate Rain', severity: 'warning' },
  65: { name: 'Heavy Rain', severity: 'warning' },
  66: { name: 'Light Freezing Rain', severity: 'warning' },
  67: { name: 'Heavy Freezing Rain', severity: 'warning' },
  71: { name: 'Slight Snow', severity: 'caution' },
  73: { name: 'Moderate Snow', severity: 'warning' },
  75: { name: 'Heavy Snow', severity: 'warning' },
  77: { name: 'Snow Grains', severity: 'warning' },
  80: { name: 'Slight Rain Showers', severity: 'caution' },
  81: { name: 'Moderate Rain Showers', severity: 'warning' },
  82: { name: 'Violent Rain Showers', severity: 'warning' },
  85: { name: 'Slight Snow Showers', severity: 'warning' },
  86: { name: 'Heavy Snow Showers', severity: 'warning' },
  95: { name: 'Thunderstorm', severity: 'danger' },
  96: { name: 'Thunderstorm with Hail', severity: 'danger' },
  99: { name: 'Thunderstorm with Heavy Hail', severity: 'danger' },
};
