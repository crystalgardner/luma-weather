import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/contexts/WeatherContext";
import { Input } from "@/components/ui/input";
import { geocodeLocation, reverseGeocodeLocation } from "@/utils/apiClient";
import { toast } from "@/hooks/use-toast";
import { SEARCH_CONFIG } from "@/constants/config";

export interface SearchResult {
  id: string;
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchProps {
  className?: string;
  compact?: boolean;
  placeholder?: string;
  onLocationSelect?: (location: any) => void;
}

export const LocationSearch = ({
  className = "",
  compact = false,
  placeholder = "Search location...",
  onLocationSelect
}: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentLocation } = useWeather();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH) {
        setLoading(true);
        try {
          const results = await geocodeLocation(query);
          setSuggestions(results);
          setIsOpen(true);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    /* 
     * NOTE: 500ms debounce gives the user enough time to finish typing "San F" 
     * before we fire off a request, preventing rate limiting and UI jank.
     */
    const timer = setTimeout(fetchSuggestions, SEARCH_CONFIG.DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: SearchResult) => {
    const locationData = {
      id: city.id,
      name: `${city.name}, ${city.region || city.country}`,
      latitude: city.latitude,
      longitude: city.longitude,
      region: city.region,
      country: city.country,
      isDefault: false,
      isFavorite: false,
    };

    if (onLocationSelect) {
      onLocationSelect(locationData);
    } else {
      setCurrentLocation(locationData);
    }

    setQuery("");
    setIsOpen(false);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let locationData = null;

        try {
          locationData = await reverseGeocodeLocation(latitude, longitude);
        } catch (error) {
          console.warn("Reverse geocoding failed, falling back to coords:", error);
          // Continue to fallback
        }

        if (locationData) {
          handleSelect(locationData);
          toast({
            title: "Location detected! 📍",
            description: `Showing weather for ${locationData.name}`,
          });
        } else {
          // Failed reverse geocoding shouldn't block use. 
          // We fall back to coordinates so the app remains functional even if the map service is down.
          setCurrentLocation({
            id: `geo-${Date.now()}`,
            name: `My Location`,
            latitude,
            longitude,
            isDefault: false,
            isFavorite: false,
          });
          toast({
            title: "Location detected! 📍",
            description: "Using your current coordinates",
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
        toast({
          title: "Permission denied",
          description: "Please allow location access to use this feature",
          variant: "destructive",
        });
      }
    );
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`${compact ? 'pl-9 pr-8 h-9 text-sm' : 'pl-10 pr-10'} bg-secondary/50 border-slate-300 focus:border-primary rounded-xl`}
          onFocus={() => query.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={handleClear}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
            aria-label="Clear search"
          >
            <X className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </button>
        )}
      </div>

      {query.length === 1 && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-popover border border-border rounded-xl shadow-sm text-xs text-muted-foreground z-50">
          Keep typing to search...
        </div>
      )}

      {!query && (
        <button
          onClick={handleLocationClick}
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-secondary rounded-lg transition-colors group"
          title="Use my location"
          aria-label="Use my current location"
        >
          <Navigation className={`w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-kawaii overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Searching...
              </div>
            ) : (
              suggestions.map((city, index) => (
                <motion.button
                  key={city.id + index}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{city.name}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      {city.region && `${city.region}, `}{city.country}
                    </span>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
