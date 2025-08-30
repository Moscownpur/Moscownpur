import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { preloadCritical } from './utils/lazyImports';
import { preloadUI } from './components/LazyUI';
import { preloadCommonIcons } from './utils/iconLoader';
import { initializeAllOptimizations } from './utils/performance';

// Defer non-critical initialization
const initApp = () => {
  // Initialize performance optimizations early
  initializeAllOptimizations();
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Preload critical components after initial render
  setTimeout(() => {
    preloadCritical();
    preloadUI();
    preloadCommonIcons();
  }, 2000);
};

// Use requestIdleCallback for better performance, fallback to setTimeout
if ('requestIdleCallback' in window) {
  requestIdleCallback(initApp);
} else {
  setTimeout(initApp, 1);
}
