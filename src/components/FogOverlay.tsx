import { motion } from "framer-motion";

interface FogOverlayProps {
  className?: string;
}

const FogOverlay = ({ className }: FogOverlayProps) => {
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + (className ?? "")}> 
      <motion.div
        className="absolute -inset-20 bg-gradient-to-b from-fog-gray/10 via-transparent to-background mix-blend-screen"
        initial={{ opacity: 0.1, x: 0, y: 0 }}
        animate={{ opacity: [0.1, 0.25, 0.15], x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-fog-gray/15 to-transparent"
        initial={{ opacity: 0.05 }}
        animate={{ opacity: [0.05, 0.15, 0.08] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

export default FogOverlay;
