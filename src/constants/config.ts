export const API_CONFIG = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',
  GEOCODING_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  REVERSE_GEOCODING_URL: 'https://geocoding-api.open-meteo.com/v1/reverse',
};

export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 500,
  MIN_QUERY_LENGTH: 2,
  RESULTS_LIMIT: 5,
};
