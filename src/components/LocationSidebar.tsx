import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Star,
  StarOff,
  Trash2,
  Plus,
  Navigation,
  Cloud,
  Pencil, // Import Pencil icon
  Check, // Import Check icon
} from "lucide-react";
import { useWeather, Location } from "@/contexts/WeatherContext";
import { PastelCard } from "./PastelCard";
import { KawaiiIcon } from "./KawaiiIcon";
import { LocationSearch } from "./LocationSearch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LocationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const LocationSidebar = ({ isOpen, onClose }: LocationSidebarProps) => {
  const {
    currentLocation,
    savedLocations,
    setCurrentLocation,
    removeLocation,
    toggleFavorite,
    addLocation,
    updateLocation,
    preferences
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null); // Track which location is being renamed
  const [tempName, setTempName] = useState(""); // Temporary name state

  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
    toast({
      title: "Location changed!",
      description: `Now showing weather for ${location.name}`,
    });
    onClose();
  };

  const handleUseCurrentLocation = () => {
    setIsSearching(true);
    // Simulate geolocation
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "Found you!",
        description: "Using your current location",
      });
    }, 1500);
  };

  const handleAddLocation = (location: Location) => {
    // Check if duplicate
    if (savedLocations.some(l => l.id === location.id)) {
      toast({
        title: "Already saved!",
        description: `${location.name} is already in your locations`,
      });
      return;
    }

    addLocation({
      ...location,
      id: Date.now().toString(),
      isFavorite: false,
    });

    toast({
      title: "Location added!",
      description: `${location.name} has been saved to your locations`,
    });
  };

  const handleEmojiClick = (emojiData: EmojiClickData, locationId: string) => {
    updateLocation(locationId, { emoji: emojiData.emoji });
    setEditingId(null);
    toast({
      title: "Emoji updated!",
      description: `Location emoji changed to ${emojiData.emoji}`,
    });
  };

  const startRenaming = (location: Location) => {
    setRenamingId(location.id);
    setTempName(location.nickname || location.name);
  };

  const saveRename = (locationId: string) => {
    if (tempName.trim()) {
      updateLocation(locationId, { nickname: tempName.trim() });
      toast({
        title: "Location renamed!",
        description: `Location saved as ${tempName.trim()}`,
      });
    }
    setRenamingId(null);
  };

  const cancelRename = () => {
    setRenamingId(null);
  };

  const sortedLocations = [...savedLocations].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-full max-w-md p-0 gap-0 border-r-0" hideDefaultClose>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Manage Locations</h2>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Current Location */}
          <div className="p-6 border-b border-border">
            <PastelCard tint="mint" interactive={false} density="compact">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Current location</p>
                  <p className="font-bold text-lg">{currentLocation.name}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <KawaiiIcon type="sun" size="md" animate={false} />
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isSaved = savedLocations.some(l => l.id === currentLocation.id);
                      if (isSaved) {
                        removeLocation(currentLocation.id);
                        toast({
                          title: "Location unsaved",
                          description: `${currentLocation.name} removed from saved locations`,
                        });
                      } else {
                        addLocation({
                          ...currentLocation,
                          id: currentLocation.id, // Use same ID or ensure uniqueness if needed, but for "current" mirroring ID is safer unless it's dynamic
                          isFavorite: true
                        });
                        // Update context if needed or just let it update
                        toast({
                          title: "Location saved!",
                          description: `${currentLocation.name} added to favorites`,
                        });
                      }
                    }}
                    className="p-2 rounded-xl hover:bg-black/5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {savedLocations.some(l => l.id === currentLocation.id) ? (
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              </div>
            </PastelCard>

            <Button
              variant="outline"
              className="w-full mt-4 rounded-2xl h-12"
              onClick={handleUseCurrentLocation}
              disabled={isSearching}
            >
              {isSearching ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Cloud className="w-5 h-5" />
                  Finding you, one sec...
                </motion.div>
              ) : (
                <>
                  <Navigation className="w-5 h-5 mr-2" />
                  Use my location
                </>
              )}
            </Button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-border">
            <div className="relative z-50">
              <LocationSearch
                placeholder="Search city to add..."
                onLocationSelect={handleAddLocation}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2 px-1">
                Find a city to add to your saved locations.
              </p>
            </div>
          </div>

          {/* Saved Locations */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Saved Locations</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary font-medium hover:bg-transparent hover:text-primary/80"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? "Done" : "Edit"}
              </Button>
            </div>
            <div className="space-y-3">
              {sortedLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PastelCard
                    tint={location.id === currentLocation.id ? "lavender" : "white"}
                    density="compact"
                    onClick={() => handleLocationSelect(location)}
                    className="group relative"
                  >
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="text-2xl hover:scale-110 transition-transform cursor-pointer p-1 rounded-lg hover:bg-black/5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(location.id);
                            }}
                          >
                            {location.emoji || <MapPin className="w-5 h-5 mx-auto" />}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent" side="right" align="start">
                          <div onClick={(e) => e.stopPropagation()}>
                            <EmojiPicker
                              onEmojiClick={(data) => handleEmojiClick(data, location.id)}
                              theme={preferences.theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                              lazyLoadEmojis={true}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>

                      <div className="flex-1 min-w-0">
                        {renamingId === location.id ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="w-full bg-background/50 border border-primary/20 rounded px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveRename(location.id);
                                if (e.key === "Escape") cancelRename();
                              }}
                              onBlur={() => saveRename(location.id)}
                            />
                          </div>
                        ) : (
                          <>
                            <p className="font-bold truncate group-hover:text-primary transition-colors">
                              {location.nickname || location.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {location.name}
                            </p>
                          </>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 ${isEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(location.id);
                          }}
                          className="p-2 rounded-xl hover:bg-secondary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {location.isFavorite ? (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </motion.button>

                        {/* Edit Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRenaming(location);
                          }}
                          className="p-2 rounded-xl hover:bg-secondary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                        {!location.isDefault && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLocation(location.id);
                              toast({
                                title: "Location removed",
                                description: `${location.name} has been removed`,
                              });
                            }}
                            className="p-2 rounded-xl hover:bg-destructive/10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </PastelCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Add Location Button */}
          <div className="p-6 border-t border-border">
            {/* Footer content if needed later, currently empty due to button removal */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
