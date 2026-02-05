import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getSmartOutfitRecommendation } from "@/data/outfitLibrary";

interface OutfitTipProps {
  temperature: number;
  rainChance: number;
  windSpeed: number;
}

export const OutfitTip = ({ temperature, rainChance, windSpeed }: OutfitTipProps) => {
  const { tip, icon: TipIcon } = getSmartOutfitRecommendation(
    temperature,
    rainChance,
    windSpeed,
    // Assuming simple logic for snow: if very cold and high precip.
    // In a real app we'd pass 'isSnowing' from weather data condition codes.
    // For now we trust the library's rain/temp logic or add a basic check:
    temperature < 32 && rainChance > 50
  );

  return (
    <motion.div
      className="bg-card rounded-3xl shadow-luma-sm p-5 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-pastel-peach">
          <TipIcon className="w-6 h-6 text-pastel-peach-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-lg">Your Outfit Tips</h4>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-pastel-lavender" />
            </motion.div>
          </div>
          <p className="text-muted-foreground">{tip}</p>
          {windSpeed > 10 && (
            <p className="text-sm text-muted-foreground mt-1">
              Max breeze: {windSpeed} mph
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
