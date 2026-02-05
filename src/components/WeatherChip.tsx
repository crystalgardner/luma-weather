import { Droplets, Wind, Sun, CloudRain, Thermometer } from "lucide-react";

type ChipType = "rain" | "wind" | "uv" | "humidity" | "temperature";

interface WeatherChipProps {
  icon: ChipType;
  label: string;
  value: string;
}

const iconMap = {
  rain: CloudRain,
  wind: Wind,
  uv: Sun,
  humidity: Droplets,
  temperature: Thermometer,
};

export const WeatherChip = ({ icon, label, value }: WeatherChipProps) => {
  const Icon = iconMap[icon];

  return (
    <div className="flex items-center gap-3 bg-card/50 rounded-2xl px-4 py-3">
      <Icon className="w-5 h-5 opacity-70" />
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-bold text-base">{value}</span>
      </div>
    </div>
  );
};
