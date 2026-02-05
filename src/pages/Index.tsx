import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Umbrella } from "lucide-react";

import { TopBar } from "@/components/TopBar";
import { GreetingCard } from "@/components/GreetingCard";
import { HeroCharacters } from "@/components/HeroCharacters";
import { NowCard, HourlyCard, DailyCard } from "@/components/WeatherCard";
import { OutfitTip } from "@/components/OutfitTip";
import { LocationSidebar } from "@/components/LocationSidebar";
import { PullToRefresh, RefreshButton } from "@/components/PullToRefresh";
import { useWeather } from "@/contexts/WeatherContext";
import { useTimeBasedTheme } from "@/hooks/useTimeBasedTheme";
import { toast } from "@/hooks/use-toast";
import crystalReyesImg from "@/assets/crystal-reyes.png";
import lumaLogoDk from "@/assets/luma-logo-dk.png";
import lumaLogoLt from "@/assets/luma-logo-lt.png";
import { PastelCard } from "@/components/PastelCard";
import { KawaiiIcon } from "@/components/KawaiiIcon";
import { SEO } from "@/components/SEO";

const Index = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isNight } = useTimeBasedTheme();
  const {
    currentLocation,
    currentWeather,
    hourlyForecast,
    dailyForecast,
    refreshWeather,
    isRefreshing,
    lastUpdated,
    isLoading,
    preferences
  } = useWeather();

  if (isLoading || !currentWeather) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-xl font-medium animate-pulse">Loading amazing weather...</div>
      </div>
    );
  }

  const handleRefresh = async () => {
    await refreshWeather();
    toast({
      title: "Weather updated!",
      description: "Fresh forecast just for you",
    });
  };

  const getLastUpdatedText = () => {
    if (!lastUpdated) return "Just now";
    const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000 / 60);
    if (diff < 1) return "Just now";
    if (diff === 1) return "1 min ago";
    return `${diff} min ago`;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
      <SEO title="Home" />
      <div className={`min-h-screen bg-background transition-colors duration-700 ${isNight ? 'night-sky' : ''}`}>
        {isNight && <div className="night-clouds" />}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12 relative z-10">
          <TopBar
            onMenuClick={() => setIsSidebarOpen(true)}
            onSettingsClick={() => navigate("/settings")}
          />

          {/* Desktop refresh button */}
          <div className="hidden md:flex justify-end mb-4">
            <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
          </div>

          {/* Weather Alerts */}


          {/* Rain Notification */}
          {preferences.notifications.rainNotifications && hourlyForecast.find((h) => h.precipitationProbability > 40) && (
            <div className="mb-6">
              <PastelCard tint="lavender" interactive={false} density="compact">
                <div className="flex items-center gap-3">
                  <KawaiiIcon type="rain" size="sm" animate={false} />
                  <p className="font-medium flex items-center gap-2">
                    <Umbrella className="w-4 h-4" />
                    Rain expected around {hourlyForecast.find((h) => h.precipitationProbability > 40)?.time.replace(/:00| AM| PM/gi, (m) => m.trim().toLowerCase().replace(':00', ''))}! Grab an umbrella!
                  </p>
                </div>
              </PastelCard>
            </div>
          )}

          <GreetingCard
            userName={preferences.userName}
            location={currentLocation.name}
            lastUpdated={getLastUpdatedText()}
            weatherType="cloud"
          />



          {/* Weather Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* NOW: Current real-time conditions only */}
            <NowCard
              temperature={currentWeather.temperature}
              feelsLike={currentWeather.feelsLike}
              high={currentWeather.high}
              low={currentWeather.low}
              showFeelsLike={preferences.showFeelsLike}
              condition={currentWeather.condition}
              rainChance={currentWeather.precipitationProbability}
              windSpeed={currentWeather.windSpeed}
              windUnit={preferences.windSpeedUnit}
              icon={hourlyForecast[0]?.icon === "moon" ? "moon" : hourlyForecast[0]?.icon === "cloud" ? "cloud" : "sun"}
            />

            <HourlyCard
              currentTemp={hourlyForecast[0]?.temperature || currentWeather.temperature}
              condition={hourlyForecast[0]?.condition || "Checking forecast..."}
              hourlyPreview={hourlyForecast.slice(1, 11).map((h) => ({
                time: h.time.replace(/:00| AM| PM/gi, (m) => m.trim().toLowerCase().replace(':00', '')),
                temp: h.temperature,
                icon: h.icon === "rain" || h.icon === "snow" || h.icon === "thunder" ? "rain" : h.icon,
              }))}
              onClick={() => navigate("/hourly")}
            />

            {/* DAILY: Weekly trend with high/low */}
            <DailyCard
              condition={dailyForecast[0]?.description || "A lovely week ahead!"}
              dailyPreview={dailyForecast.slice(1, 6).map((d) => {
                const date = new Date(d.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                return {
                  day: dayName,
                  high: d.high,
                  low: d.low,
                  icon: d.icon === "rain" || d.icon === "snow" || d.icon === "thunder" ? "rain" : d.icon as "sun" | "cloud" | "moon",
                };
              })}
              onClick={() => navigate("/daily")}
            />
          </motion.div>

          {/* Outfit Tips */}
          <motion.div
            onClick={() => navigate("/outfit")}
            className="cursor-pointer"
            whileHover={{ scale: 1.01 }}
          >
            <OutfitTip
              temperature={currentWeather.temperature}
              rainChance={currentWeather.precipitationProbability}
              windSpeed={currentWeather.windSpeed}
            />
          </motion.div>

          <motion.footer
            className="flex flex-col items-center gap-3 mt-4 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <img
              src={isNight ? lumaLogoDk : lumaLogoLt}
              alt="LumaWeather logo"
              className="h-24 w-auto mb-4 opacity-80"
            />

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/crystalgardner/luma-weather"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <span>
                Code by{" "}
                <span>
                  <a
                    href="https://crystalreyes.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:text-foreground transition-colors"
                  >
                    Crystal Reyes
                  </a>
                </span>
                .
              </span>
            </div>
            <div>
              Weather data provided by{" "}
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Open-Meteo.com
              </a>
            </div>
            <button
              onClick={() => navigate("/about")}
              className="mt-2 text-xs text-muted-foreground/80 hover:text-primary hover:underline transition-colors"
            >
              About Luma Weather
            </button>
          </motion.footer>
        </div>

        {/* Location Sidebar */}
        <LocationSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </PullToRefresh >
  );
};

export default Index;
