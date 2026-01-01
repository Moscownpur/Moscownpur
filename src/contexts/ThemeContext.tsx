import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';

// Define the shape of the context data
interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the props for the provider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('orange'); // Default color

  // On initial load, try to get the theme from local storage
  useEffect(() => {
    const storedColor = localStorage.getItem('moscownpur-theme-color');
    if (storedColor) {
      setPrimaryColor(storedColor);
    }
  }, []);

  // useMemo to create the context value, ensuring it only changes when needed
  const contextValue = useMemo(() => ({
    primaryColor,
    setPrimaryColor: (color: string) => {
      setPrimaryColor(color);
      localStorage.setItem('moscownpur-theme-color', color);
    }
  }), [primaryColor]);

  // Effect to update the CSS variable on the root element
  useEffect(() => {
    // This assumes your colors are from Tailwind's default palette, e.g., 'red-500'
    // We will apply the base color name to a CSS variable.
    // For this to work, you need to define your colors in your global CSS using this variable.
    // e.g., :root { --primary-color: hsl(var(--primary-hue), 80%, 50%); }
    document.documentElement.style.setProperty('--primary-color-name', primaryColor);
    // You would then have a map in your CSS to convert 'red' to HSL values for '--primary-hue'.
    // A simpler approach for now is to just set the variable and use it where possible.
    // The provided ThemeSwitcher seems to rely on Tailwind classes directly.
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
