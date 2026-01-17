'use client';

import { motion } from 'framer-motion';

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-orange-400/30 to-orange-600/20 blur-3xl"
      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      style={{ top: '10%', left: '10%' }}
    />
    <motion.div
      className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-orange-300/20 to-yellow-400/20 blur-3xl"
      animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      style={{ top: '50%', right: '10%' }}
    />
    <motion.div
      className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-orange-500/15 to-red-400/15 blur-3xl"
      animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      style={{ bottom: '20%', left: '30%' }}
    />
  </div>
);

export default FloatingOrbs;
