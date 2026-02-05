import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shirt,
  Umbrella,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  Glasses,
  Footprints,
  Heart,
  Smile,
  ClipboardList
} from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";
import { useTimeBasedTheme } from "@/hooks/useTimeBasedTheme";
import { PastelCard } from "@/components/PastelCard";
import { KawaiiIcon } from "@/components/KawaiiIcon";
import { SEO } from "@/components/SEO";

interface OutfitItem {
  name: string;
  icon: React.ElementType;
  status: "recommended" | "optional" | "not-needed";
  reason?: string;
}

const OutfitRecommendations = () => {
  const navigate = useNavigate();
  const { currentWeather, hourlyForecast } = useWeather();
  const { isNight } = useTimeBasedTheme();

  if (!currentWeather) {
    return (
      <div className={`min-h-screen bg-background transition-colors duration-700 ${isNight ? 'night-sky' : ''} flex items-center justify-center`}>
        {isNight && <div className="night-clouds" />}
        <div className="relative z-10 text-center">
          <KawaiiIcon type="sun" size="lg" animate />
          <p className="mt-4 text-muted-foreground animate-pulse">Checking the weather wardrobe...</p>
        </div>
      </div>
    );
  }

  const getOutfitItems = (): OutfitItem[] => {
    const items: OutfitItem[] = [];
    const temp = currentWeather.temperature;
    const feelsLike = currentWeather.feelsLike;
    const rain = currentWeather.precipitationProbability;
    const uv = currentWeather.uvIndex;
    const wind = currentWeather.windSpeed;

    // --- Base Layers (Tops) ---
    if (feelsLike < 40) {
      items.push({
        name: "Heavy Coat",
        icon: Shirt,
        status: "recommended",
        reason: "It's freezing! Bundle up tight",
      });
      items.push({
        name: "Sweater / Layers",
        icon: Shirt,
        status: "recommended",
        reason: "Layer up to stay warm",
      });
    } else if (feelsLike < 55) {
      items.push({
        name: "Coat or Thick Jacket",
        icon: Shirt,
        status: "recommended",
        reason: "Quite chilly out there",
      });
    } else if (feelsLike < 65) {
      items.push({
        name: "Light Jacket / Cardigan",
        icon: Shirt,
        status: "recommended",
        reason: "A bit nip in the air",
      });
    } else if (feelsLike < 75) {
      items.push({
        name: "T-Shirt & Light Layer",
        icon: Shirt,
        status: "recommended",
        reason: "Perfect weather, maybe a light layer",
      });
    } else if (feelsLike < 85) {
      items.push({
        name: "Short Sleeves",
        icon: Shirt,
        status: "recommended",
        reason: "Warm and sunny!",
      });
    } else {
      items.push({
        name: "Tank Top / Light Clothes",
        icon: Shirt,
        status: "recommended",
        reason: "It's hot! Wear breathable fabrics",
      });
    }

    // --- Accessories ---
    if (feelsLike < 45) {
      items.push({
        name: "Scarf & Gloves",
        icon: Shirt,
        status: "recommended",
        reason: "Keep extremities warm!",
      });
    }

    // Rain Gear
    if (rain > 40) {
      items.push({
        name: "Umbrella",
        icon: Umbrella,
        status: "recommended",
        reason: `High chance of rain (${rain}%)`,
      });
      items.push({
        name: "Raincoat / Waterproofs",
        icon: Shirt,
        status: "recommended",
        reason: "Stay dry!",
      });
    } else if (rain > 20) {
      items.push({
        name: "Small Umbrella",
        icon: Umbrella,
        status: "optional",
        reason: "Just in case of sprinkles",
      });
    }

    // Sun Protection
    if (uv >= 6) {
      items.push({
        name: "Sunscreen & Hat",
        icon: Sun,
        status: "recommended",
        reason: `UV is High (${uv}) - Protect skin!`,
      });
      items.push({
        name: "Sunglasses",
        icon: Glasses,
        status: "recommended",
        reason: "Bright sun today",
      });
    } else if (uv >= 3) {
      items.push({
        name: "Sunglasses",
        icon: Glasses,
        status: "optional",
        reason: "Good for sunny spells",
      });
    }

    // Wind
    if (wind > 15 && feelsLike < 70) {
      items.push({
        name: "Windbreaker",
        icon: Wind,
        status: "recommended",
        reason: `Gusty winds at ${wind} mph`,
      });
    }

    // Footwear
    if (rain > 50) {
      items.push({
        name: "Rain Boots",
        icon: Footprints,
        status: "recommended",
        reason: "Puddles likely!",
      });
    } else if (temp > 80 && rain < 10) {
      items.push({
        name: "Sandals / Breathable Shoes",
        icon: Footprints,
        status: "recommended",
        reason: "Let your feet breathe",
      });
    } else {
      items.push({
        name: "Sneakers / Comfy Shoes",
        icon: Footprints,
        status: "recommended",
        reason: "Standard comfy footwear",
      });
    }

    // Hydration
    if (temp > 75) {
      items.push({
        name: "Water Bottle",
        icon: Droplets,
        status: "recommended",
        reason: "Stay hydrated in the heat!",
      });
    }

    return items;
  };

  const outfitItems = getOutfitItems();
  const recommended = outfitItems.filter((i) => i.status === "recommended");
  const optional = outfitItems.filter((i) => i.status === "optional");

  // Get outfit headline
  const getHeadline = () => {
    const temp = currentWeather.temperature;
    const rain = currentWeather.precipitationProbability;

    if (rain > 60) return "Definitely an umbrella day!";
    if (temp > 90) return "Stay cool, it's scorching!";
    if (temp > 80) return "Beautiful summer vibes!";
    if (temp > 65) return "Comfortable & Mild";
    if (temp > 50) return "Sweater Weather";
    if (temp > 32) return "Chilly! Bundle up!";
    return "Brrr! Freezing out there!";
  };



  return (
    <div className={`min-h-screen bg-background transition-colors duration-700 ${isNight ? 'night-sky' : ''}`}>
      <SEO title="Outfit Recommendations" description="What to wear based on today's weather." />
      {isNight && <div className="night-clouds" />}
      <div className="max-w-2xl mx-auto px-4 md:px-8 pb-12 relative z-10">
        {/* Header */}
        <motion.header
          className="flex items-center gap-4 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            What to Wear Today?
            <Shirt className="w-6 h-6 text-pastel-pink" />
          </h1>
        </motion.header>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PastelCard tint="mint" interactive={false} className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <KawaiiIcon type="sun" size="lg" animate />
              <div>
                <h2 className="text-2xl font-bold">{getHeadline()}</h2>
                <p className="text-muted-foreground">
                  {currentWeather.temperature}° • Feels like {currentWeather.feelsLike}°
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-card rounded-full text-sm">
                High {currentWeather.temperature + 5}°
              </span>
              <span className="px-3 py-1 bg-card rounded-full text-sm">
                Low {currentWeather.temperature - 10}°
              </span>
              <span className="px-3 py-1 bg-card rounded-full text-sm flex items-center gap-2">
                <Droplets className="w-3 h-3" />
                {currentWeather.precipitationProbability}% rain
              </span>
            </div>
          </PastelCard>
        </motion.div>

        {/* Recommended Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pastel-pink" />
            Recommended
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {recommended.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <PastelCard tint="pink" density="compact">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-card rounded-2xl flex items-center justify-center">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <p className="font-bold">{item.name}</p>
                    {item.reason && (
                      <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                    )}
                  </div>
                </PastelCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Optional Items */}
        {optional.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Smile className="w-5 h-5 text-pastel-lavender" />
              Optional
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {optional.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <PastelCard tint="lavender" density="compact">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-card rounded-2xl flex items-center justify-center">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <p className="font-bold">{item.name}</p>
                      {item.reason && (
                        <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                      )}
                    </div>
                  </PastelCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weather Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <PastelCard tint="peach" interactive={false}>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Don't forget!
            </h3>
            <ul className="space-y-2">
              {currentWeather.uvIndex > 5 && (
                <li className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span>UV index is {currentWeather.uvIndex} - sunscreen time!</span>
                </li>
              )}
              {currentWeather.precipitationProbability > 20 && (
                <li className="flex items-center gap-2">
                  <Umbrella className="w-4 h-4" />
                  <span>{currentWeather.precipitationProbability}% chance of rain later</span>
                </li>
              )}
              {currentWeather.windSpeed > 10 && (
                <li className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span>It's breezy at {currentWeather.windSpeed} mph</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <ThermometerSun className="w-4 h-4" />
                <span>Feels like {currentWeather.feelsLike}° outside</span>
              </li>
            </ul>
          </PastelCard>
        </motion.div>


      </div>
    </div>
  );
};

export default OutfitRecommendations;
