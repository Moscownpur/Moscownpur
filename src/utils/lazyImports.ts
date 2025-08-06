// Lazy import utilities to reduce initial bundle size

// Lazy load Framer Motion components
export const lazyMotion = () => import('framer-motion');

// Lazy load Lucide React icons
export const lazyIcons = () => import('lucide-react');

// Lazy load form libraries
export const lazyForms = () => Promise.all([
  import('react-hook-form'),
  import('@hookform/resolvers'),
  import('yup')
]);

// Lazy load AI library
export const lazyAI = () => import('@google/genai');

// Lazy load utility libraries
export const lazyUtils = () => Promise.all([
  import('uuid'),
  import('bcryptjs')
]);

// Lazy load toast library
export const lazyToast = () => import('react-hot-toast');

// Preload critical components
export const preloadCritical = () => {
  // Preload components that are likely to be used soon
  setTimeout(() => {
    lazyMotion();
    lazyIcons();
  }, 1000);
};

// Preload components based on user interaction
export const preloadOnHover = (component: () => Promise<any>) => {
  let preloaded = false;
  
  return () => {
    if (!preloaded) {
      preloaded = true;
      component();
    }
  };
};

// Conditional loading based on feature flags
export const conditionalImport = (condition: boolean, importFn: () => Promise<any>) => {
  if (condition) {
    return importFn();
  }
  return Promise.resolve(null);
}; 