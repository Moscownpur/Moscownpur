import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defer non-critical initialization
const initApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Use requestIdleCallback for better performance, fallback to setTimeout
if ('requestIdleCallback' in window) {
  requestIdleCallback(initApp);
} else {
  setTimeout(initApp, 1);
}
