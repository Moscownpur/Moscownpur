import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const variants = {
    primary: 'from-purple-500 to-pink-500 soft-glow-purple',
    secondary: 'from-slate-600 to-slate-700 soft-glow',
    success: 'from-green-500 to-emerald-500 soft-glow-green',
    danger: 'from-red-500 to-pink-500 soft-glow-pink'
  };

  const sizes = {
    sm: 'px-4 py-2 text-caption',
    md: 'px-6 py-3 text-body',
    lg: 'px-8 py-4 text-subheading'
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl font-medium text-white
        bg-gradient-to-r ${variants[variant]}
        smooth-transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default NeonButton;