import { motion } from "framer-motion";
import { PastelCard } from "./PastelCard";
import { KawaiiIcon } from "./KawaiiIcon";
import { Droplets, Wind, ChevronRight } from "lucide-react";

// ====== NOW CARD ======
interface NowCardProps {
  temperature: number;
  feelsLike: number;
  high: number;
  low: number;
  showFeelsLike?: boolean;
  condition: string;
  rainChance: number;
  windSpeed: number;
  windUnit?: string;
  icon: "sun" | "cloud" | "moon";
  onClick?: () => void;
}

export const NowCard = ({
  temperature,
  feelsLike,
  high,
  low,
  showFeelsLike = true,
  condition,
  rainChance,
  windSpeed,
  windUnit = "mph",
  icon,
  onClick,
}: NowCardProps) => {
  return (
    <PastelCard
      tint="pink"
      density="compact"
      className="flex flex-col min-h-[280px]"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          {/* Header */}
          <h3 className="text-xl font-bold mt-1 mb-2">Now</h3>

          {/* Main Temperature */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-bold tracking-tight">{temperature}°</span>
          </div>

          {showFeelsLike && <p className="text-lg text-muted-foreground mb-1">Feels like {feelsLike}°</p>}
          <p className="text-lg text-muted-foreground mb-1">
            Day {high}° · Night {low}°
          </p>
          <p className="text-base font-medium mb-4">{condition}</p>
        </div>

        <KawaiiIcon type={icon} size="xl" animate={false} />
      </div>

      {/* Current Stats - Only rain + wind */}
      <div className="flex gap-4 mt-auto pt-3 border-t border-foreground/5">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-500" />
          <span className="text-base font-medium">{rainChance}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-slate-500" />
          <span className="text-base font-medium">{windSpeed} {windUnit}</span>
        </div>
      </div>
    </PastelCard>
  );
};

// ====== HOURLY CARD ======
interface HourlyPreview {
  time: string;
  temp: number;
  icon: "sun" | "cloud" | "moon" | "rain";
}

interface HourlyCardProps {
  currentTemp: number;
  condition: string;
  hourlyPreview: HourlyPreview[];
  onClick?: () => void;
}

export const HourlyCard = ({
  currentTemp,
  condition,
  hourlyPreview,
  onClick,
}: HourlyCardProps) => {
  return (
    <PastelCard
      tint="mint"
      density="compact"
      onClick={onClick}
      className="flex flex-col min-h-[260px] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">Hourly</h3>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Current hour temp */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-5xl font-bold tracking-tight">{currentTemp}°</span>
        <span className="text-lg text-muted-foreground">now</span>
      </div>

      <p className="text-base text-muted-foreground mb-4">{condition}</p>

      {/* Next hours preview */}
      <div className="grid grid-cols-5 gap-y-4 gap-x-2 mt-auto pt-3 border-t border-foreground/5">
        {hourlyPreview.slice(0, 5).map((hour, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="text-xs text-muted-foreground">{hour.time}</span>
            <KawaiiIcon type={hour.icon === "rain" ? "cloud" : hour.icon} size="sm" animate={false} />
            <span className="text-sm font-semibold">{hour.temp}°</span>
          </motion.div>
        ))}
      </div>
    </PastelCard>
  );
};

// ====== DAILY CARD ======
interface DailyPreview {
  day: string;
  high: number;
  low: number;
  icon: "sun" | "cloud" | "moon" | "rain";
}

interface DailyCardProps {
  condition: string;
  dailyPreview: DailyPreview[];
  onClick?: () => void;
}

export const DailyCard = ({
  condition,
  dailyPreview,
  onClick,
}: DailyCardProps) => {
  return (
    <PastelCard
      tint="lavender"
      density="compact"
      onClick={onClick}
      className="flex flex-col min-h-[260px] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">7-Day</h3>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      <p className="text-base text-muted-foreground mb-4">{condition}</p>

      {/* Next days preview */}
      <div className="grid grid-cols-5 gap-y-4 gap-x-2 mt-auto pt-3 border-t border-foreground/5">
        {dailyPreview.slice(0, 5).map((d, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="text-xs text-muted-foreground">{d.day}</span>
            <KawaiiIcon type={d.icon} size="sm" animate={false} />
            <div className="flex flex-col items-center text-xs">
              <span className="font-semibold">{d.high}°</span>
              <span className="text-muted-foreground">{d.low}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </PastelCard>
  );
};


