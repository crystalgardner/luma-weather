import { Shirt, Umbrella, Wind, Sun, CloudSnow, Thermometer, CloudRain } from "lucide-react";

export type OutfitCondition = "rain" | "snow" | "wind" | "hot" | "warm" | "mild" | "cool" | "cold" | "freezing";

export interface OutfitRecommendation {
  id: string;
  condition: OutfitCondition;
  text: string;
  icon: any; // Lucide icon component
  minTemp?: number;
  maxTemp?: number;
}

const OUTFIT_LIBRARY: OutfitRecommendation[] = [
  // --- RAIN ---
  {
    id: "rain-1",
    condition: "rain",
    text: "Rainy day alert! 🌧️ Don't forget your umbrella and waterproof shoes.",
    icon: Umbrella,
  },
  {
    id: "rain-2",
    condition: "rain",
    text: "It's a bit wet out there. A raincoat is your best friend today!",
    icon: CloudRain,
  },
  {
    id: "rain-3",
    condition: "rain",
    text: "Puddle jumping weather! ☔ Rain boots and a trench coat would look cute.",
    icon: Umbrella,
  },

  // --- SNOW ---
  {
    id: "snow-1",
    condition: "snow",
    text: "Snow day! ❄️ Bundle up in your warmest puffer jacket and gloves.",
    icon: CloudSnow,
  },
  {
    id: "snow-2",
    condition: "snow",
    text: "It's winter wonderland! Heavy coat, scarf, and boots are a must.",
    icon: CloudSnow,
  },

  // --- WIND ---
  {
    id: "wind-1",
    condition: "wind",
    text: "Whoosh! It's blustery. A windbreaker will keep you comfy.",
    icon: Wind,
  },
  {
    id: "wind-2",
    condition: "wind",
    text: "Hold onto your hat! 🍃 Secure loose items and wear a wind-resistant layer.",
    icon: Wind,
  },

  // --- FREEZING (< 32F / 0C) ---
  {
    id: "freezing-1",
    condition: "freezing",
    text: "Brrr! It's freezing! 🥶 Thermal layers, thick coat, hat, and gloves required.",
    icon: Thermometer,
    maxTemp: 32,
  },
  {
    id: "freezing-2",
    condition: "freezing",
    text: "Ice cold! Stay warm with fleece lining and heavy knits.",
    icon: CloudSnow,
    maxTemp: 32,
  },

  // --- COLD (32-50F / 0-10C) ---
  {
    id: "cold-1",
    condition: "cold",
    text: "Chilly vibes! 🧣 A warm coat and a cozy scarf are perfect.",
    icon: Shirt,
    minTemp: 32,
    maxTemp: 50,
  },
  {
    id: "cold-2",
    condition: "cold",
    text: "Sweater weather max! Layer a turtleneck under a wool coat.",
    icon: Shirt,
    minTemp: 32,
    maxTemp: 50,
  },
  {
    id: "cold-3",
    condition: "cold",
    text: "Crisp air today. A beanie and a sturdy jacket will do the trick.",
    icon: Shirt,
    minTemp: 32,
    maxTemp: 50,
  },

  // --- COOL (50-65F / 10-18C) ---
  {
    id: "cool-1",
    condition: "cool",
    text: "Fresh and crisp! A denim jacket or light bomber is perfect.",
    icon: Shirt,
    minTemp: 50,
    maxTemp: 65,
  },
  {
    id: "cool-2",
    condition: "cool",
    text: "Light sweater weather. 🧶 Cozy but not too heavy.",
    icon: Shirt,
    minTemp: 50,
    maxTemp: 65,
  },
  {
    id: "cool-3",
    condition: "cool",
    text: "Perfect layering weather! A hoodie or cardigan is just right.",
    icon: Shirt,
    minTemp: 50,
    maxTemp: 65,
  },

  // --- MILD (65-75F / 18-24C) ---
  {
    id: "mild-1",
    condition: "mild",
    text: "Beautifully mild! A long-sleeve tee or light blouse is great.",
    icon: Shirt,
    minTemp: 65,
    maxTemp: 75,
  },
  {
    id: "mild-2",
    condition: "mild",
    text: "Just right! You might likely skip the jacket today.",
    icon: Sun,
    minTemp: 65,
    maxTemp: 75,
  },
  {
    id: "mild-3",
    condition: "mild",
    text: "Comfortable weather. Jeans and a tee work perfectly.",
    icon: Shirt,
    minTemp: 65,
    maxTemp: 75,
  },

  // --- WARM (75-85F / 24-29C) ---
  {
    id: "warm-1",
    condition: "warm",
    text: "It's getting warm! ☀️ Short sleeves and sunglasses time.",
    icon: Sun,
    minTemp: 75,
    maxTemp: 85,
  },
  {
    id: "warm-2",
    condition: "warm",
    text: "Summer feelings! A sundress or shorts would be lovely.",
    icon: Sun,
    minTemp: 75,
    maxTemp: 85,
  },
  {
    id: "warm-3",
    condition: "warm",
    text: "T-shirt weather! Don't forget sunscreen.",
    icon: Shirt,
    minTemp: 75,
    maxTemp: 85,
  },

  // --- HOT (> 85F / 29C) ---
  {
    id: "hot-1",
    condition: "hot",
    text: "It's a scorcher! 🥵 Stay cool in breathable fabrics like linen or cotton.",
    icon: Sun,
    minTemp: 85,
  },
  {
    id: "hot-2",
    condition: "hot",
    text: "Heat warning! Tank tops, shorts, and plenty of water! 💧",
    icon: Sun,
    minTemp: 85,
  },
  {
    id: "hot-3",
    condition: "hot",
    text: "Very hot today. Stay in the shade and wear light colors.",
    icon: Sun,
    minTemp: 85,
  },
];

export const getSmartOutfitRecommendation = (
  tempF: number,
  rainChance: number,
  windSpeed: number,
  isSnowing: boolean = false
): { tip: string; icon: any } => {
  let matchedTips: OutfitRecommendation[] = [];

  // 1. Priority: Heavy Precipitation
  if (isSnowing) {
    matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "snow");
  } else if (rainChance > 50) {
    matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "rain");
  }
  // 2. Priority: High Wind (if not raining heavily)
  else if (windSpeed > 20) {
    matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "wind");
  }
  // 3. Temperature Logic
  else {
    if (tempF < 32) {
      matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "freezing");
    } else if (tempF >= 32 && tempF < 50) {
      matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "cold");
    } else if (tempF >= 50 && tempF < 65) {
      matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "cool");
    } else if (tempF >= 65 && tempF < 75) {
      matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "mild");
    } else if (tempF >= 75 && tempF < 85) {
      matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "warm");
    } else {
      matchedTips = OUTFIT_LIBRARY.filter(t => t.condition === "hot");
    }
  }

  // Fallback if something goes wrong (shouldn't happen with full coverage)
  if (matchedTips.length === 0) {
    return { tip: "Dress comfortably for the day!", icon: Shirt };
  }

  // Randomize selection from matched tips
  const randomTip = matchedTips[Math.floor(Math.random() * matchedTips.length)];
  return { tip: randomTip.text, icon: randomTip.icon };
};
