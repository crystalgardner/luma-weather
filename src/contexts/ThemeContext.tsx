import React, { createContext, useContext, useEffect, useState } from "react";
import { TIME_BOUNDARIES, THEME_UPDATE_INTERVAL_MS } from "@/constants/time";

interface ThemeContextType {
  isNight: boolean;
  disableNightShift: boolean;
  setDisableNightShift: (disable: boolean) => void;
  period: string; // Expose calculated period for Settings page
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNight, setIsNight] = useState(false);
  const [disableNightShift, setDisableNightShift] = useState(false);
  const [period, setPeriod] = useState("day");

  useEffect(() => {
    const saved = localStorage.getItem("disableNightShift");
    if (saved) {
      setDisableNightShift(JSON.parse(saved));
    }
  }, []);

  /* 
   * We persist this preference because if a user explicitly turns off 
   * night mode, they probably want it to stay off next time they visit.
   */
  useEffect(() => {
    localStorage.setItem("disableNightShift", JSON.stringify(disableNightShift));

    const updateTheme = () => {
      const hour = new Date().getHours();

      let currentPeriod = "day";
      if (hour >= TIME_BOUNDARIES.MORNING_START && hour < TIME_BOUNDARIES.AFTERNOON_START) currentPeriod = "morning";
      else if (hour >= TIME_BOUNDARIES.AFTERNOON_START && hour < TIME_BOUNDARIES.EVENING_START) currentPeriod = "afternoon";
      else if (hour >= TIME_BOUNDARIES.EVENING_START && hour < TIME_BOUNDARIES.NIGHT_START_EVENING) currentPeriod = "evening";
      else currentPeriod = "night";
      setPeriod(currentPeriod);

      const isNightTime = hour >= TIME_BOUNDARIES.NIGHT_START_LATE || hour < TIME_BOUNDARIES.MORNING_START_EARLY;
      const shouldBeNight = disableNightShift ? false : isNightTime;

      setIsNight(shouldBeNight);

      if (shouldBeNight) {
        document.documentElement.classList.add("night");
      } else {
        document.documentElement.classList.remove("night");
      }
    };

    updateTheme();

    // Check every minute. No need for real-time precision here; the sky doesn't change that fast.
    const interval = setInterval(updateTheme, THEME_UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [disableNightShift]);

  return (
    <ThemeContext.Provider value={{ isNight, disableNightShift, setDisableNightShift, period }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTimeBasedTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useTheme = useTimeBasedTheme; 
