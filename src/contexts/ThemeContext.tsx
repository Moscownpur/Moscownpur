import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';

// Define the shape of the context data
interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the props for the provider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>(() => {
    // Initialize primaryColor from localStorage or default to 'orange'
    return localStorage.getItem('moscownpur-theme-color') || 'orange';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Initialize theme from localStorage or default to 'dark'
    const storedTheme = localStorage.getItem('moscownpur-ui-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Default to 'dark' if no preference or invalid value
    return 'dark';
  });

  // Define a map for color names to OKLCH values
  const oklchColorMap: { [key: string]: { primary: string; foreground: string } } = useMemo(() => ({
    red: { primary: '0.6368 0.2078 25.3313', foreground: '0.2244 0.0074 67.4370' }, // Example Red
    green: { primary: '0.6300 0.1600 135.0000', foreground: '0.0500 0.0000 0.0000' }, // Example Green
    blue: { primary: '0.5500 0.2000 240.0000', foreground: '0.9800 0.0000 0.0000' }, // Example Blue
    yellow: { primary: '0.8800 0.1300 90.0000', foreground: '0.0500 0.0000 0.0000' }, // Example Yellow
    purple: { primary: '0.5000 0.1800 300.0000', foreground: '0.9800 0.0000 0.0000' }, // Example Purple
    
    // Base ShadCN-like color values (adjust as needed for your exact palette)
    orange: { primary: '0.8280 0.1890 84.4290', foreground: '0.2244 0.0074 67.4370' },
    amber: { primary: '0.8790 0.1690 91.6050', foreground: '0.2244 0.0074 67.4370' },
    lime: { primary: '0.8200 0.1500 100.0000', foreground: '0.2244 0.0074 67.4370' },
    emerald: { primary: '0.7000 0.1500 140.0000', foreground: '0.2244 0.0074 67.4370' },
    teal: { primary: '0.6000 0.1500 180.0000', foreground: '0.2244 0.0074 67.4370' },
    cyan: { primary: '0.6500 0.1500 200.0000', foreground: '0.2244 0.0074 67.4370' },
    sky: { primary: '0.6800 0.1500 220.0000', foreground: '0.2244 0.0074 67.4370' },
    indigo: { primary: '0.5200 0.1500 270.0000', foreground: '0.9800 0.0074 67.4370' },
    violet: { primary: '0.5500 0.1500 290.0000', foreground: '0.9800 0.0074 67.4370' },
    fuchsia: { primary: '0.6000 0.1500 320.0000', foreground: '0.9800 0.0074 67.4370' },
    pink: { primary: '0.6500 0.1500 340.0000', foreground: '0.9800 0.0074 67.4370' },
    rose: { primary: '0.6800 0.1500 350.0000', foreground: '0.9800 0.0074 67.4370' },
    slate: { primary: '0.6000 0.0200 250.0000', foreground: '0.9800 0.0074 67.4370' },
    gray: { primary: '0.6000 0.0100 250.0000', foreground: '0.9800 0.0074 67.4370' },
    zinc: { primary: '0.6000 0.0050 250.0000', foreground: '0.9800 0.0074 67.4370' },
    neutral: { primary: '0.6000 0.0000 0.0000', foreground: '0.9800 0.0074 67.4370' },
    stone: { primary: '0.6500 0.0100 60.0000', foreground: '0.0500 0.0000 0.0000' },
  }), []);


  // Effect to apply the 'dark' class to the root element and persist theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('moscownpur-ui-theme', theme);
  }, [theme]);

  // Effect to update the CSS variables for the primary color and its shades
  useEffect(() => {
    const root = document.documentElement;
    const colorData = oklchColorMap[primaryColor];

    if (colorData) {
      // Set foreground color
      root.style.setProperty('--primary-foreground', `oklch(${colorData.foreground})`);

      // Parse the primary color's L, C, H values
      const [L, C, H] = colorData.primary.split(' ').map(parseFloat);

      // Set the base primary color
      root.style.setProperty('--primary', `oklch(${L} ${C} ${H})`);

      // Calculate and set a darker shade
      const darkerL = Math.max(0, L - 0.1);
      const darkerC = C + 0.04; // Slightly more saturation for depth
      root.style.setProperty('--primary-darker', `oklch(${darkerL} ${darkerC} ${H})`);
      
      // Calculate and set a lighter shade
      const lighterL = Math.min(1, L + 0.1);
      const lighterC = Math.max(0, C - 0.04); // Slightly less saturation for a washout effect
      root.style.setProperty('--primary-lighter', `oklch(${lighterL} ${lighterC} ${H})`);
    }
    
    localStorage.setItem('moscownpur-theme-color', primaryColor);
  }, [primaryColor, oklchColorMap]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // useMemo to create the context value, ensuring it only changes when needed
  const contextValue = useMemo(() => ({
    primaryColor,
    setPrimaryColor,
    theme,
    toggleTheme,
  }), [primaryColor, theme]);

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
