import React from 'react';

// Icon loader utility for reducing Lucide bundle size

const iconCache = new Map<string, any>();

export const loadIcon = async (iconName: string) => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  try {
    const module = await import('lucide-react');
    const IconComponent = module[iconName as keyof typeof module];
    
    if (IconComponent) {
      iconCache.set(iconName, IconComponent);
      return IconComponent;
    }
    
    throw new Error(`Icon ${iconName} not found`);
  } catch (error) {
    console.warn(`Failed to load icon ${iconName}:`, error);
    return null;
  }
};

// Preload commonly used icons
export const preloadCommonIcons = () => {
  const commonIcons = ['Plus', 'Edit', 'Search', 'Globe', 'Users', 'Calendar'];
  
  commonIcons.forEach(iconName => {
    setTimeout(() => loadIcon(iconName), 1000);
  });
};

// Lazy icon component
export const LazyIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const [IconComponent, setIconComponent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadIcon(name).then(component => {
      setIconComponent(component);
      setLoading(false);
    });
  }, [name]);

  if (loading) {
    return React.createElement('div', { 
      className: `w-4 h-4 bg-gray-300 rounded ${props.className}` 
    });
  }

  if (!IconComponent) {
    return React.createElement('div', { 
      className: `w-4 h-4 bg-red-300 rounded ${props.className}` 
    });
  }

  return React.createElement(IconComponent, props);
}; 