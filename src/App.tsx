import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "@/contexts/WeatherContext";
import Index from "./pages/Index";
import HourlyView from "./pages/HourlyView";
import DailyView from "./pages/DailyView";
import Settings from "./pages/Settings";
import About from "./pages/About";
import OutfitRecommendations from "./pages/OutfitRecommendations";

import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/contexts/ThemeContext";

import { AppLoader } from "./components/AppLoader";

const App = () => (
  <ThemeProvider>
    <AppLoader />
    <WeatherProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hourly" element={<HourlyView />} />
            <Route path="/daily" element={<DailyView />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/outfit" element={<OutfitRecommendations />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WeatherProvider>
  </ThemeProvider>
);

export default App;
