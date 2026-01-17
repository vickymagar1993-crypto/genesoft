"use client";

import { motion } from "framer-motion";

// Dynamic animated orbs background matching orange/white theme
const BackgroundOrbs = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Large orange orb top left */}
    <motion.div
      className="absolute w-[60vw] h-[60vw] min-w-[400px] min-h-[400px] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-br from-orange-400/40 via-orange-500/30 to-white/20 blur-3xl"
      animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      style={{ top: "-10%", left: "-10%" }}
    />
    {/* White orb center right */}
    <motion.div
      className="absolute w-[40vw] h-[40vw] min-w-[250px] min-h-[250px] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-white/60 via-orange-100/40 to-orange-300/20 blur-2xl"
      animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
      transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      style={{ top: "30%", right: "-15%" }}
    />
    {/* Subtle orange orb bottom left */}
    <motion.div
      className="absolute w-[30vw] h-[30vw] min-w-[180px] min-h-[180px] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-tl from-orange-300/30 via-orange-200/20 to-white/10 blur-2xl"
      animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      style={{ bottom: "-10%", left: "-10%" }}
    />
  </div>
);

export default BackgroundOrbs;