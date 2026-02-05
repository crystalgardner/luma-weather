import { WEATHER_CODES } from "./weatherCodes";

const WEATHER_MESSAGES = {
  clear: [
    "Yay! It's super sunny and beautiful! ☀️",
    "Perfect weather for a little adventure.",
    "Don't forget your sunnies! 😎",
    "Soak up that sunshine!",
    "It's a happy blue sky day.",
  ],
  cloudy: [
    "The clouds are giving the sun a hug. ☁️",
    "Cozy vibes only today.",
    "A perfect day for a warm cup of tea.",
    "Soft gray skies are kinda nice, right?",
    "Sweater weather is the best weather.",
  ],
  rain: [
    "Pitter patter! Don't forget your umbrella. ☔",
    "Nature is taking a little shower.",
    "Perfect excuse to stay in and cuddle.",
    "Time to rock those rainboots!",
    "Stay dry and cozy inside! 🏠",
  ],
  snow: [
    "It's a winter wonderland out there! ❄️",
    "Time for hot cocoa and fuzzy socks.",
    "Everything looks like a sugar cookie.",
    "Bundle up, little marshmallow!",
    "Stay warm and snuggly.",
  ],
  thunder: [
    "Whoa, the sky is grumpy today! ⛈️",
    "Safe and sound inside is the place to be.",
    "Thunder buddies for life!",
    "Let's stay in and watch movies.",
  ],
  fog: [
    "It's a little mysterious out there... 🌫️",
    "The world is wearing a soft blanket.",
    "Be careful, it's a bit hard to see!",
  ]
};

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getCuteWeatherMessage = (code: number, isNight: boolean = false): string => {
  // Clear
  if (code === WEATHER_CODES.CLEAR_SKY || code === WEATHER_CODES.MAINLY_CLEAR) {
    if (isNight) return "Have a restful night.";
    return pickRandom(WEATHER_MESSAGES.clear);
  }

  // Cloudy
  if (code >= 2 && code <= 3) return pickRandom(WEATHER_MESSAGES.cloudy);

  // Fog
  if (code === 45 || code === 48) return pickRandom(WEATHER_MESSAGES.fog);

  // Rain / Drizzle
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82)
  ) return pickRandom(WEATHER_MESSAGES.rain);

  // Snow
  if (
    (code >= 71 && code <= 77) ||
    (code >= 85 && code <= 86)
  ) return pickRandom(WEATHER_MESSAGES.snow);

  // Thunder
  if (code >= 95) return pickRandom(WEATHER_MESSAGES.thunder);

  // Default fallback
  return "Have a great day!";
};
