import React, { Suspense, lazy } from 'react';

// Lazy load heavy UI components
const LazyMotion = lazy(() => import('framer-motion').then(module => ({
  default: ({ children, ...props }: any) => React.createElement(module.motion.div, props, children)
})));

const LazyAnimatePresence = lazy(() => import('framer-motion').then(module => ({
  default: module.AnimatePresence
})));

// Lazy load specific icons
const LazyIcons = {
  Plus: lazy(() => import('lucide-react').then(module => ({ default: module.Plus }))),
  Edit: lazy(() => import('lucide-react').then(module => ({ default: module.Edit }))),
  Trash2: lazy(() => import('lucide-react').then(module => ({ default: module.Trash2 }))),
  Search: lazy(() => import('lucide-react').then(module => ({ default: module.Search }))),
  Globe: lazy(() => import('lucide-react').then(module => ({ default: module.Globe }))),
  Users: lazy(() => import('lucide-react').then(module => ({ default: module.Users }))),
  Calendar: lazy(() => import('lucide-react').then(module => ({ default: module.Calendar }))),
  BookOpen: lazy(() => import('lucide-react').then(module => ({ default: module.BookOpen }))),
  Film: lazy(() => import('lucide-react').then(module => ({ default: module.Film }))),
  MapPin: lazy(() => import('lucide-react').then(module => ({ default: module.MapPin }))),
  Clock: lazy(() => import('lucide-react').then(module => ({ default: module.Clock }))),
  MessageSquare: lazy(() => import('lucide-react').then(module => ({ default: module.MessageSquare }))),
  Edit2: lazy(() => import('lucide-react').then(module => ({ default: module.Edit2 }))),
  GripVertical: lazy(() => import('lucide-react').then(module => ({ default: module.GripVertical }))),
  ArrowLeft: lazy(() => import('lucide-react').then(module => ({ default: module.ArrowLeft }))),
};

// Loading fallback
const IconFallback = ({ className }: { className?: string }) => (
  <div className={`w-4 h-4 bg-gray-300 rounded ${className}`} />
);

// Wrapper components with error boundaries
export const LazyIcon = ({ name, ...props }: { name: keyof typeof LazyIcons; [key: string]: any }) => {
  const IconComponent = LazyIcons[name];
  
  return (
    <Suspense fallback={<IconFallback className={props.className} />}>
      <IconComponent {...props} />
    </Suspense>
  );
};

export const LazyMotionDiv = ({ children, ...props }: any) => (
  <Suspense fallback={<div {...props}>{children}</div>}>
    <LazyMotion {...props}>{children}</LazyMotion>
  </Suspense>
);

export const LazyAnimatePresenceWrapper = ({ children, ...props }: any) => (
  <Suspense fallback={<>{children}</>}>
    <LazyAnimatePresence {...props}>{children}</LazyAnimatePresence>
  </Suspense>
);

// Preload critical UI components
export const preloadUI = () => {
  // Preload most commonly used icons
  setTimeout(() => {
    import('lucide-react').then(module => {
      // Preload specific icons
      const icons = [module.Plus, module.Edit, module.Search, module.Globe];
      icons.forEach(icon => {
        // Force module to be loaded
        if (icon) console.log('Preloaded icon:', icon.name);
      });
    });
  }, 2000);
}; 