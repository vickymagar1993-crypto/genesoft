'use client';

import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl rounded-2xl ${className}`}
    whileHover={hover ? { y: -5, shadow: '0 25px 50px -12px rgba(249, 115, 22, 0.25)' } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default GlassCard;
