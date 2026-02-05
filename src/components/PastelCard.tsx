import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Tint = "pink" | "mint" | "lavender" | "peach" | "cream" | "white";

interface PastelCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  tint?: Tint;
  interactive?: boolean;
  density?: "compact" | "normal" | "spacious";
  children: React.ReactNode;
}

const tintClasses: Record<Tint, string> = {
  pink: "luma-card-pink",
  mint: "luma-card-mint",
  lavender: "luma-card-lavender",
  peach: "luma-card-peach",
  cream: "bg-cream", // Keeping as utility for now unless I define luma-card-cream
  white: "bg-card", // Default white
};

const densityClasses = {
  compact: "p-3",
  normal: "p-4",
  spacious: "p-6",
};

export const PastelCard = ({
  tint = "white",
  interactive = true,
  density = "normal",
  children,
  className,
  onClick,
  ...props
}: PastelCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e as any);
    }
  };

  return (
    <motion.div
      className={cn(
        "luma-card", // Base card class
        tintClasses[tint],
        densityClasses[density],
        interactive && "luma-card-interactive cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none", // Added focus styles
        className
      )}
      whileHover={undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </motion.div>
  );
};
