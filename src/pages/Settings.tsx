import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Thermometer,
  Moon,
  Sun,
  Bell,
  Clock,
  Wind,
  Eye,
  Heart
} from "lucide-react";


import { useWeather } from "@/contexts/WeatherContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PastelCard } from "@/components/PastelCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const Settings = () => {
  const navigate = useNavigate();
  const { isNight, period, disableNightShift, setDisableNightShift } = useTheme();
  const { preferences, updatePreferences } = useWeather();
  const [nameError, setNameError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 20) {
      setNameError("Name must be 20 characters or less");
      // Still update but maybe show error? Or prevent update?
      // Let's prevent update if > 20 but user might want to delete.
      // Better to allow typing but show error, or just slice it.
      // Let's just slice it to 20 chars to be "strict" as requested by plan "Limit max length".
      // Actually plan said "Limit max length... Show an error message".
      // Let's allow typing up to 20.
      return;
    }
    setNameError("");
    updatePreferences({ userName: value });
  };

  const handleUnitChange = (unit: "celsius" | "fahrenheit") => {
    updatePreferences({ temperatureUnit: unit });
    toast({
      title: "Units updated! 🌡️",
      description: `Temperature now shown in ${unit === "celsius" ? "Celsius" : "Fahrenheit"}`,
    });
  };

  const getThemeDescription = () => {
    if (isNight) {
      return "It's nighttime - cozy night mode is active";
    }
    switch (period) {
      case "morning": return "Good morning! Bright daytime theme active";
      case "afternoon": return "Afternoon vibes - daytime theme active";
      case "evening": return "Evening approaching - night mode coming soon";
      default: return "Daytime theme active";
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-colors duration-700 ${isNight ? 'night-sky' : ''}`}>
      <SEO title="Settings" description="Customize your Luma Weather experience." />
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
          <h1 className="text-2xl font-bold">Settings</h1>
        </motion.header>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Temperature Units */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PastelCard tint="pink" interactive={false}>
              <div className="flex items-center gap-3 mb-4">
                <Thermometer className="w-5 h-5" />
                <h3 className="font-bold text-lg">Temperature</h3>
              </div>
              <div className="flex bg-secondary/50 p-1 rounded-2xl w-full">
                <button
                  onClick={() => handleUnitChange("fahrenheit")}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${preferences.temperatureUnit === "fahrenheit"
                    ? "bg-background shadow-luma-sm text-foreground"
                    : "text-zinc-500 hover:text-foreground"
                    }`}
                >
                  °F Fahrenheit
                </button>
                <button
                  onClick={() => handleUnitChange("celsius")}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${preferences.temperatureUnit === "celsius"
                    ? "bg-background shadow-luma-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  °C Celsius
                </button>
              </div>
            </PastelCard>
          </motion.div>

          {/* Theme Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PastelCard tint="lavender" interactive={false}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isNight ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      {getThemeDescription()}
                    </p>
                  </div>
                </div>
                <div className="text-2xl">
                  {isNight ? (
                    <Moon className="w-8 h-8 text-pastel-lavender fill-pastel-lavender/20" />
                  ) : (
                    <Sun className="w-8 h-8 text-orange-400 fill-orange-400/20" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                Theme changes automatically based on time of day
              </p>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <p className="font-medium">Night Shift</p>
                  <p className="text-sm text-muted-foreground">Automatically switch to dark mode at night</p>
                </div>
                <Switch
                  checked={!disableNightShift}
                  onCheckedChange={(checked) => setDisableNightShift(!checked)}
                  className="data-[state=checked]:bg-[hsl(255,60%,75%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>
            </PastelCard>
          </motion.div>
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PastelCard tint="mint" interactive={false}>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5" />
                <h3 className="font-bold text-lg">Notifications</h3>
              </div>
              <div className="space-y-4">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rain Notifications</p>
                    <p className="text-sm text-muted-foreground">"Grab umbrella!" reminders</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.rainNotifications}
                    onCheckedChange={(checked) =>
                      updatePreferences({
                        notifications: { ...preferences.notifications, rainNotifications: checked },
                      })
                    }
                    className="data-[state=checked]:bg-[hsl(160,50%,70%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                </div>
              </div>
            </PastelCard>
          </motion.div>


          {/* Display Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PastelCard tint="peach" interactive={false}>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5" />
                <h3 className="font-bold text-lg">Display</h3>
              </div>
              <div className="space-y-4">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <p className="font-medium">Time Format</p>
                  </div>
                  <div className="flex bg-secondary/50 p-1 rounded-xl">
                    <button
                      onClick={() => updatePreferences({ timeFormat: "12h" })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${preferences.timeFormat === "12h"
                        ? "bg-background shadow-luma-sm text-foreground"
                        : "text-zinc-500 hover:text-foreground"
                        }`}
                    >
                      12h
                    </button>
                    <button
                      onClick={() => updatePreferences({ timeFormat: "24h" })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${preferences.timeFormat === "24h"
                        ? "bg-background shadow-luma-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      24h
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    <p className="font-medium">Wind Speed</p>
                  </div>
                  <div className="flex bg-secondary/50 p-1 rounded-xl">
                    <button
                      onClick={() => updatePreferences({ windSpeedUnit: "mph" })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${preferences.windSpeedUnit === "mph"
                        ? "bg-background shadow-luma-sm text-foreground"
                        : "text-zinc-500 hover:text-foreground"
                        }`}
                    >
                      mph
                    </button>
                    <button
                      onClick={() => updatePreferences({ windSpeedUnit: "kmh" })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${preferences.windSpeedUnit === "kmh"
                        ? "bg-background shadow-luma-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      km/h
                    </button>
                  </div>
                </div>
              </div>
            </PastelCard>
          </motion.div>

          {/* Personalization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PastelCard tint="pink" interactive={false}>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5" />
                <h3 className="font-bold text-lg">Personalization</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="font-medium block mb-2">Your Name</label>
                  <div className="relative">
                    <Input
                      value={preferences.userName}
                      onChange={handleNameChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      placeholder="sunshine"
                      className={`rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 ${nameError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                      maxLength={20}
                    />
                    {nameError && (
                      <p className="text-xs text-red-500 mt-1 absolute right-0 top-full">
                        {nameError}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      We'll use this for greetings!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {preferences.userName.length}/20
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cute Language</p>
                    <p className="text-sm text-muted-foreground">Friendly weather descriptions</p>
                  </div>
                  <Switch
                    checked={preferences.cuteLanguage}
                    onCheckedChange={(checked) =>
                      updatePreferences({ cuteLanguage: checked })
                    }
                    className="data-[state=checked]:bg-[hsl(350,80%,70%)]"
                  />
                </div>
              </div>
            </PastelCard>
          </motion.div>




        </div>
      </div>
    </div>
  );
};

export default Settings;
