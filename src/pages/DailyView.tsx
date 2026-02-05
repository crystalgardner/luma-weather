import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, List, CalendarDays, Sunrise, Sunset, ChevronDown, Droplets } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useWeather } from "@/contexts/WeatherContext";
import { useTimeBasedTheme } from "@/hooks/useTimeBasedTheme";
import { PastelCard } from "@/components/PastelCard";
import { KawaiiIcon } from "@/components/KawaiiIcon";
import { WeatherChip } from "@/components/WeatherChip";
import { SEO } from "@/components/SEO";

type ViewMode = "list" | "calendar";

const DailyView = () => {
  const navigate = useNavigate();
  const { currentLocation, dailyForecast, preferences } = useWeather();
  const { isNight } = useTimeBasedTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const tints = ["pink", "mint", "lavender", "peach", "pink", "mint", "lavender"] as const;

  return (
    <div className={`min-h-screen bg-background transition-colors duration-700 ${isNight ? 'night-sky' : ''}`}>
      <SEO title="7-Day Forecast" description="Check the weekly forecast for your location." />
      {isNight && <div className="night-clouds" />}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12 relative z-10">
        {/* Header */}
        <TopBar
          showBack
          onBackClick={() => navigate("/")}
          onSettingsClick={() => navigate("/settings")}
        />

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">7-Day Forecast</h1>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{currentLocation.name}</span>
          </div>
        </div>

        {/* View Toggle */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${viewMode === "list"
              ? "bg-pastel-mint text-pastel-mint-foreground font-bold"
              : "bg-card hover:bg-secondary"
              }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all ${viewMode === "calendar"
              ? "bg-pastel-mint text-pastel-mint-foreground font-bold"
              : "bg-card hover:bg-secondary"
              }`}
          >
            <CalendarDays className="w-4 h-4" />
            Calendar
          </button>
        </motion.div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {dailyForecast.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <PastelCard
                  tint={tints[index]}
                  density="normal"
                  onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <KawaiiIcon type={day.icon} size="lg" animate={false} />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-xl font-bold">{day.dayName}</h3>
                        <span className="text-muted-foreground">{day.date}</span>
                      </div>
                      <p className="text-muted-foreground mb-2">{day.condition}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold">High: {day.high}°</span>
                        <span className="text-muted-foreground">Low: {day.low}°</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: selectedDay === index ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence initial={false}>
                    {selectedDay === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: {
                            height: { type: "spring", stiffness: 400, damping: 35 },
                            opacity: { duration: 0.2, delay: 0.05 }
                          }
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          transition: {
                            height: { type: "spring", stiffness: 400, damping: 35 },
                            opacity: { duration: 0.15 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-foreground/10">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            <WeatherChip icon="rain" label="Precip" value={`${day.precipitationProbability}% (${day.precipitation} in)`} />
                            <WeatherChip icon="wind" label="Wind" value={`${day.windSpeed} ${preferences.windSpeedUnit} ${day.windDirection}`} />
                            <WeatherChip icon="wind" label="Gusts" value={`${day.windGusts} ${preferences.windSpeedUnit}`} />
                            <WeatherChip icon="humidity" label="Humidity" value={`${day.humidity}%`} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sunrise className="w-4 h-4" />
                              <span>{day.sunrise}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Sunset className="w-4 h-4" />
                              <span>{day.sunset}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm italic">{day.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </PastelCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {dailyForecast.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <PastelCard
                  tint={tints[index]}
                  density="compact"
                  onClick={() => setSelectedDay(index)}
                  className="text-center"
                >
                  <p className="font-bold mb-1">{day.dayName}</p>
                  <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
                  <KawaiiIcon type={day.icon} size="md" animate={false} className="mx-auto" />
                  <div className="mt-2">
                    <p className="font-bold">{day.high}°</p>
                    <p className="text-sm text-muted-foreground">{day.low}°</p>
                  </div>
                  {day.precipitationProbability > 30 && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3" /> {day.precipitationProbability}%
                    </p>
                  )}
                </PastelCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Selected Day Detail Modal */}
        {selectedDay !== null && viewMode === "calendar" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <PastelCard tint="white" interactive={false}>
              <div className="flex items-center gap-4 mb-4">
                <KawaiiIcon type={dailyForecast[selectedDay].icon} size="lg" animate />
                <div>
                  <h3 className="text-xl font-bold">{dailyForecast[selectedDay].dayName}</h3>
                  <p className="text-muted-foreground">{dailyForecast[selectedDay].condition}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pastel-pink/30 rounded-2xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">High</p>
                  <p className="text-2xl font-bold">{dailyForecast[selectedDay].high}°</p>
                </div>
                <div className="bg-pastel-lavender/30 rounded-2xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Low</p>
                  <p className="text-2xl font-bold">{dailyForecast[selectedDay].low}°</p>
                </div>
              </div>
              <p className="mt-4 text-center italic">{dailyForecast[selectedDay].description}</p>
            </PastelCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DailyView;
