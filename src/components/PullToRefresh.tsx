import { useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { KawaiiIcon } from "./KawaiiIcon";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

const PULL_THRESHOLD = 80;

export const PullToRefresh = ({ onRefresh, children, disabled = false }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const y = useMotionValue(0);

  const rotation = useTransform(y, [0, PULL_THRESHOLD], [0, 360]);
  const opacity = useTransform(y, [0, 40, PULL_THRESHOLD], [0, 0.5, 1]);
  const scale = useTransform(y, [0, PULL_THRESHOLD], [0.5, 1]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - startY.current);
    const dampedDiff = Math.min(diff * 0.5, PULL_THRESHOLD * 1.5);

    y.set(dampedDiff);
    setPullProgress(Math.min(dampedDiff / PULL_THRESHOLD, 1));
  };

  const handleTouchEnd = async () => {
    if (!isDragging.current || disabled) return;
    isDragging.current = false;

    const currentY = y.get();

    if (currentY >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      animate(y, 60, { duration: 0.2 });

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        animate(y, 0, { duration: 0.3 });
        setPullProgress(0);
      }
    } else {
      animate(y, 0, { duration: 0.3 });
      setPullProgress(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center pointer-events-none"
        style={{
          y: useTransform(y, (v) => v - 80),
          opacity,
          scale,
        }}
      >
        <motion.div
          style={{ rotate: isRefreshing ? undefined : rotation }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : undefined}
        >
          <KawaiiIcon type="sun" size="lg" animate={false} />
        </motion.div>
        <motion.p
          className="text-sm font-medium text-foreground mt-2"
          animate={isRefreshing ? { opacity: [1, 0.5, 1] } : undefined}
          transition={isRefreshing ? { duration: 1.5, repeat: Infinity } : undefined}
        >
          {isRefreshing
            ? "Refreshing... ✨"
            : pullProgress >= 1
              ? "Release to refresh! 🌈"
              : "Pull down to refresh ☁️"
          }
        </motion.p>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

// Desktop-friendly refresh button component
interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const RefreshButton = ({ onRefresh, isRefreshing }: RefreshButtonProps) => {
  return (
    <motion.button
      onClick={() => !isRefreshing && onRefresh()}
      disabled={isRefreshing}
      aria-label={isRefreshing ? "Refreshing weather data" : "Refresh weather data"}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card shadow-luma-sm hover:shadow-kawaii transition-all disabled:opacity-50"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : undefined}
        transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : undefined}
      >
        <KawaiiIcon type="sun" size="sm" animate={false} />
      </motion.div>
      <span className="text-sm font-medium">
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </span>
    </motion.button>
  );
};
