import React from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'white',
  onClick 
}) => {
  const glowColors = {
    white: 'hover:soft-glow',
    purple: 'hover:soft-glow-purple',
    blue: 'hover:soft-glow-blue',
    pink: 'hover:soft-glow-pink',
    green: 'hover:soft-glow-green',
    orange: 'hover:soft-glow-orange'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        glass-card rounded-2xl ${glowColors[glowColor as keyof typeof glowColors]}
        smooth-transition cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlowCard;