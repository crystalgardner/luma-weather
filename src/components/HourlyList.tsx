import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Wind, Umbrella, CloudRain } from "lucide-react";
import { PastelCard } from "./PastelCard";
import { KawaiiIcon } from "./KawaiiIcon";
import { HourlyForecast } from "@/contexts/WeatherContext";

interface HourlyListProps {
  data: HourlyForecast[];
  windUnit: string;
}

export const HourlyList = ({ data, windUnit }: HourlyListProps) => {
  const [expandedHour, setExpandedHour] = useState<number | null>(null);

  const tints = ["pink", "mint", "lavender", "peach"] as const;

  return (
    <div className="space-y-3">
      {data.map((hour, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <PastelCard
            tint={index === 0 ? "mint" : tints[index % 4]}
            density="compact"
            onClick={() => setExpandedHour(expandedHour === index ? null : index)}
            className={index === 0 ? "ring-2 ring-pastel-mint" : ""}
          >
            <div className="flex items-center gap-4">
              <KawaiiIcon type={hour.icon} size="md" animate={false} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-bold text-xl">
                    {index === 0 ? "Now" : hour.time}
                  </span>
                  <span className="text-muted-foreground text-base">{hour.condition}</span>
                </div>
                <div className="flex items-center gap-6 mt-2 text-base text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" />
                    {hour.precipitationProbability}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4" />
                    {hour.windSpeed} {windUnit}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">{hour.temperature}°</span>
                <p className="text-sm text-muted-foreground">
                  Feels {hour.feelsLike}°
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedHour === index ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              </motion.div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence initial={false}>
              {expandedHour === index && (
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Precipitation</p>
                          <p className="font-bold">{hour.precipitationProbability}% ({hour.precipitation} in)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center">
                          <Wind className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Wind</p>
                          <p className="font-bold">{hour.windSpeed} {windUnit} {hour.windDirection}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center">
                          <Wind className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Wind Gusts</p>
                          <p className="font-bold">{hour.windGusts} {windUnit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Humidity</p>
                          <p className="font-bold">{hour.cloudCover}%</p>
                        </div>
                      </div>
                    </div>
                    {hour.humidity > 70 && (
                      <p className="mt-3 text-sm italic text-muted-foreground flex items-center gap-2">
                        <Droplets className="w-4 h-4" /> Humidity is high - might feel muggy!
                      </p>
                    )}
                    {hour.precipitationProbability > 40 && (
                      <p className="mt-3 text-sm italic text-muted-foreground flex items-center gap-2">
                        <Umbrella className="w-4 h-4" /> Good time to have an umbrella handy!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </PastelCard>
        </motion.div>
      ))}
    </div>
  );
};
