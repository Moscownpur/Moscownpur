import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface DynamicLogoProps {
  scrolled: boolean;
  className?: string; // Optional for additional styling
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({ scrolled, className }) => {
  const { primaryOklch, primaryDarkerOklch, primaryLighterOklch } = useTheme();

  // Define sensible default opacities for the blend layers
  // These could be made configurable if needed
  const brightnessOpacity = 0.2; // Corresponds to brightnessSlider.value / 100
  const tintOpacity = 0.8;     // Corresponds to tintOpacity.value / 100
  const colorOverlayOpacity = 0.8; // Corresponds to colorOpacity.value / 100

  return (
    <div className={`relative flex items-center justify-center ${scrolled ? "w-8 h-8" : "w-10 h-10"} transition-all duration-500 ${className}`}>
      {/* Base Logo (Grayscale, Brightness, Contrast) - Z-index 1 */}
      <img
        src="/logo-v2.png"
        alt="Moscownpur Logo"
        className={`w-full h-full object-contain z-10 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180`}
        style={{ filter: 'grayscale(100%) brightness(1.2) contrast(1.1)' }}
      />

      {/* Brightness Overlay (mimicking brightness-overlay) - Z-index 2 */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: 'white',
          mixBlendMode: 'soft-light',
          opacity: brightnessOpacity
        }}
      ></div>

      {/* Tint Overlay (mimicking tint-overlay) - Z-index 3 */}
      <div
        className="absolute inset-0 z-30"
        style={{
          backgroundColor: primaryOklch, // Use the exposed primary color
          mixBlendMode: 'color',
          opacity: tintOpacity
        }}
      ></div>

      {/* Color Overlay (mimicking color-overlay) - Z-index 4 */}
      <div
        className="absolute inset-0 z-40"
        style={{
          background: `linear-gradient(135deg, ${primaryDarkerOklch} 25%, ${primaryOklch} 50%, ${primaryLighterOklch} 75%)`,
          mixBlendMode: 'multiply',
          opacity: colorOverlayOpacity
        }}
      ></div>

      {/* Logo Glow (from PublicHeader - Ensure it's above all blends or carefully considered) */}
      <div 
        className="absolute inset-0 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full z-50" // Ensure glow is on top
        style={{ background: primaryOklch }} // Use primaryOklch for the glow
      ></div>
    </div>
  );
};

export default DynamicLogo;
