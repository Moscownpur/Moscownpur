import React from 'react';
import { motion } from 'framer-motion';

interface FloatingEmojiProps {
  emoji: string;
  delay?: number;
}

const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ emoji, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-5, 5, -5]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className="text-2xl select-none"
    >
      {emoji}
    </motion.div>
  );
};

export default FloatingEmoji;