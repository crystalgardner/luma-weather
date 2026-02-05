import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KawaiiIcon } from "./KawaiiIcon";

export const AppLoader = () => {
  // Start visible
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleLoad = async () => {
      // 1. Wait for fonts to be ready
      await document.fonts.ready;

      // 2. Minimum nice-to-look-at duration (1.2s)
      // This prevents a jarring "flash" if the app loads instantly
      setTimeout(() => {
        setIsVisible(false);
      }, 1200);
    };

    handleLoad();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mb-8"
          >
            <KawaiiIcon type="sun" size="hero" animate />
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-foreground font-gaegu"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your weather... ⛅
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
