import { motion } from "framer-motion";
import { KawaiiIcon } from "./KawaiiIcon";

export const HeroCharacters = () => {
  return (
    <div className="flex items-end justify-center gap-6 md:gap-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <KawaiiIcon type="sun" size="hero" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-4"
      >
        <KawaiiIcon type="cloud" size="hero" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <KawaiiIcon type="moon" size="hero" />
      </motion.div>
    </div>
  );
};
