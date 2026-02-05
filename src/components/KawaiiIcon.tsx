import { motion } from "framer-motion";
import kawaiiSun from "@/assets/luma-sun.png";
import kawaiiCloud from "@/assets/luma-cloud.png";
import kawaiiMoon from "@/assets/luma-moon.png";
import kawaiiRain from "@/assets/luma-rain.png";
import kawaiiSnow from "@/assets/luma-snow.png";

type IconType = "sun" | "cloud" | "moon" | "rain" | "snow" | "thunder";
type Mood = "happy" | "neutral" | "sleepy" | "concerned";

interface KawaiiIconProps {
  type: IconType;
  mood?: Mood;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  animate?: boolean;
  className?: string;
}

const iconMap: Record<string, string> = {
  sun: kawaiiSun,
  cloud: kawaiiCloud,
  moon: kawaiiMoon,
  rain: kawaiiRain,
  snow: kawaiiSnow,
  thunder: kawaiiCloud,
};

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
  hero: "w-32 h-32 md:w-40 md:h-40",
};

export const KawaiiIcon = ({
  type,
  size = "md",
  animate = true,
  className = "",
}: KawaiiIconProps) => {
  const icon = iconMap[type] || kawaiiCloud;

  return (
    <motion.div
      className={`${sizeMap[size]} ${className}`}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={
        animate
          ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: type === "cloud" ? 0.5 : type === "moon" ? 1 : 0,
          }
          : undefined
      }
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={icon}
        alt={`Kawaii ${type}`}
        className="w-full h-full object-contain drop-shadow-kawaii"
        draggable={false}
      />
    </motion.div>
  );
};
