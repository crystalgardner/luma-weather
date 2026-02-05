import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useWeather } from "@/contexts/WeatherContext";
import { useTimeBasedTheme } from "@/hooks/useTimeBasedTheme";
import { PastelCard } from "@/components/PastelCard";
import { KawaiiIcon } from "@/components/KawaiiIcon";
import { HourlyChart } from "@/components/HourlyChart";
import { HourlyList } from "@/components/HourlyList";
import { SEO } from "@/components/SEO";

const HourlyView = () => {
  const navigate = useNavigate();
  const { currentLocation, hourlyForecast, preferences } = useWeather();
  const { isNight } = useTimeBasedTheme();

  // Find if rain is coming
  const rainHour = hourlyForecast.find((h) => h.precipitationProbability > 40);

  return (
    <div className={`min-h-screen bg-background transition-colors duration-700 ${isNight ? 'night-sky' : ''}`}>
      <SEO title="24-Hour Forecast" description="Hourly weather forecast details." />
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12 relative z-10">
        {/* Header */}
        <TopBar
          showBack
          onBackClick={() => navigate("/")}
          onSettingsClick={() => navigate("/settings")}
        />

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">24-Hour Forecast</h1>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{currentLocation.name}</span>
          </div>
        </div>

        {/* Rain Alert Banner */}
        {rainHour && preferences.notifications.rainNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PastelCard tint="lavender" interactive={false} density="compact" className="mb-6">
              <div className="flex items-center gap-3">
                <KawaiiIcon type="rain" size="sm" animate={false} />
                <p className="font-medium">
                  🌧️ Rain expected around {rainHour.time}! Grab an umbrella, friend!
                </p>
              </div>
            </PastelCard>
          </motion.div>
        )}

        {/* Temperature Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <HourlyChart data={hourlyForecast} />
        </motion.div>

        {/* Hourly Timeline Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Hour by Hour</h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 py-8">
            <div className="flex gap-3" style={{ width: "max-content" }}>
              {hourlyForecast.slice(0, 12).map((hour, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.03 }}
                >
                  <PastelCard
                    tint={index === 0 ? "mint" : "white"}
                    density="compact"
                    className={`w-20 text-center ${index === 0 ? "ring-2 ring-pastel-mint" : ""}`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {index === 0 ? "Now" : hour.time}
                    </p>
                    <KawaiiIcon type={hour.icon} size="sm" animate={false} />
                    <p className="font-bold text-lg mt-1">{hour.temperature}°</p>
                    {hour.precipitationProbability > 20 && (
                      <p className="text-xs text-muted-foreground">
                        💧 {hour.precipitationProbability}%
                      </p>
                    )}
                  </PastelCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Hourly List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Detailed Forecast</h2>
          <HourlyList data={hourlyForecast} windUnit={preferences.windSpeedUnit} />
        </motion.div>
      </div>
    </div>
  );
};

export default HourlyView;
