import { useNavigate } from "react-router-dom";
import { Menu, Settings, ArrowLeft } from "lucide-react";

import lumaLogoDk from "@/assets/luma-logo-dk.png";
import lumaLogoLt from "@/assets/luma-logo-lt.png";
import { useTheme } from "@/contexts/ThemeContext";
import { LocationSearch } from "@/components/LocationSearch";

interface TopBarProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  showBack?: boolean;
  onBackClick?: () => void;
}

export const TopBar = ({
  onMenuClick,
  onSettingsClick,
  showBack = false,
  onBackClick,
}: TopBarProps) => {
  const navigate = useNavigate();
  const { isNight } = useTheme();

  return (
    <header
      className="flex flex-col gap-2 py-2 px-4"
    >
      <div className="flex items-center justify-between">
        {showBack ? (
          <button
            onClick={onBackClick}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
            aria-label="Open main menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        )}

        <img
          src={isNight ? lumaLogoDk : lumaLogoLt}
          alt="LumaWeather"
          className="h-24 md:h-32 w-auto cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate("/")}
        />

        <button
          onClick={onSettingsClick}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
          aria-label="Open settings"
        >
          <Settings className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <LocationSearch compact className="w-full max-w-md mx-auto" />
    </header>
  );
};
