// Tree shaking utilities to help remove unused code

// Only import what you need from large libraries
export const importOnly = {
  // Framer Motion - only import used components
  motion: () => import('framer-motion').then(m => m.motion),
  AnimatePresence: () => import('framer-motion').then(m => m.AnimatePresence),
  
  // Lucide React - only import used icons
  icons: {
    Plus: () => import('lucide-react').then(m => m.Plus),
    Edit: () => import('lucide-react').then(m => m.Edit),
    Trash: () => import('lucide-react').then(m => m.Trash2),
    Search: () => import('lucide-react').then(m => m.Search),
    Globe: () => import('lucide-react').then(m => m.Globe),
    Users: () => import('lucide-react').then(m => m.Users),
    Calendar: () => import('lucide-react').then(m => m.Calendar),
    BookOpen: () => import('lucide-react').then(m => m.BookOpen),
    Film: () => import('lucide-react').then(m => m.Film),
    MapPin: () => import('lucide-react').then(m => m.MapPin),
    Clock: () => import('lucide-react').then(m => m.Clock),
    MessageSquare: () => import('lucide-react').then(m => m.MessageSquare),
    Edit2: () => import('lucide-react').then(m => m.Edit2),
    Trash2: () => import('lucide-react').then(m => m.Trash2),
    GripVertical: () => import('lucide-react').then(m => m.GripVertical),
    ArrowLeft: () => import('lucide-react').then(m => m.ArrowLeft),
  },
  
  // React Hook Form - only import used functions
  form: {
    useForm: () => import('react-hook-form').then(m => m.useForm),
    Controller: () => import('react-hook-form').then(m => m.Controller),
  },
  
  // Yup - only import used validators
  validation: {
    object: () => import('yup').then(m => m.object),
    string: () => import('yup').then(m => m.string),
    number: () => import('yup').then(m => m.number),
    array: () => import('yup').then(m => m.array),
  },
};

// Conditional imports based on environment
export const conditionalImports = {
  // Only load AI features in development or when explicitly enabled
  ai: () => {
    if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_AI === 'true') {
      return import('@google/genai');
    }
    return Promise.resolve(null);
  },
  
  // Only load Supabase when credentials are available
  supabase: () => {
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return import('@supabase/supabase-js');
    }
    return Promise.resolve(null);
  },
};

// Lazy load components with error boundaries
export const lazyLoadWithFallback = (importFn: () => Promise<any>, fallback: any) => {
  return async () => {
    try {
      return await importFn();
    } catch (error) {
      console.warn('Failed to load component, using fallback:', error);
      return fallback;
    }
  };
}; 