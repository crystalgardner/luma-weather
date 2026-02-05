import { motion } from "framer-motion";
import { MapPin, RefreshCw, Moon, Sun, CloudSun, Sparkles } from "lucide-react";
import { KawaiiIcon } from "./KawaiiIcon";

interface GreetingCardProps {
  userName?: string;
  location?: string;
  lastUpdated?: string;
  weatherType?: "sun" | "cloud" | "moon";
}

const getGreeting = (name: string) => {
  const hour = new Date().getHours();
  // Use user's name or fallback to "sunshine" if empty/undefined
  const displayName = name || "sunshine";

  if (hour >= 0 && hour < 5) return { text: `Sweet dreams, ${displayName}!`, icon: Moon };
  if (hour < 12) return { text: `Good morning, ${displayName}!`, icon: Sun };
  if (hour < 17) return { text: `Good afternoon, ${displayName}!`, icon: CloudSun };
  if (hour < 21) return { text: `Good evening, ${displayName}!`, icon: Sparkles };
  return { text: `Good night, ${displayName}!`, icon: Moon };
};

export const GreetingCard = ({
  userName = "sunshine",
  location = "Atlanta, GA",
  lastUpdated = "3 min ago",
  weatherType = "cloud",
}: GreetingCardProps) => {
  const { text, icon: Icon } = getGreeting(userName);

  return (
    <motion.div
      className="luma-card p-4 mb-4 watercolor-wash"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            {text} <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin className="w-5 h-5" />
            <span className="text-xl">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-pastel-mint"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-base">Updated: {lastUpdated}</span>
          </div>
        </div>
        <div className="hidden md:block">
          <KawaiiIcon type={weatherType} size="hero" />
        </div>
      </div>
    </motion.div>
  );
};
