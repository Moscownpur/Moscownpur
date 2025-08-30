// Performance optimization utilities for better SEO and user experience

export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch' | 'prerender';
  href: string;
  as?: string;
  type?: string;
  crossorigin?: boolean;
}

export interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
}

/**
 * Add resource hints to improve loading performance
 */
export const addResourceHints = (hints: ResourceHint[]): void => {
  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    
    if (hint.as) link.setAttribute('as', hint.as);
    if (hint.type) link.setAttribute('type', hint.type);
    if (hint.crossorigin) link.setAttribute('crossorigin', '');
    
    document.head.appendChild(link);
  });
};

/**
 * Preload critical assets
 */
export const preloadCriticalAssets = (): void => {
  const criticalAssets = [
    { href: '/logo.jpg', as: 'image', type: 'image/jpeg' },
    { href: '/src/main.tsx', as: 'script', type: 'module' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
  ];

  addResourceHints(criticalAssets.map(asset => ({
    rel: 'preload',
    href: asset.href,
    as: asset.as as string,
    type: asset.type
  })));
};

/**
 * Preconnect to external domains
 */
export const preconnectExternalDomains = (): void => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://vercel.live',
    'https://api.moscownpur.in'
  ];

  addResourceHints(domains.map(domain => ({
    rel: 'preconnect',
    href: domain,
    crossorigin: true
  })));
};

/**
 * Monitor Core Web Vitals
 */
export const monitorCoreWebVitals = (): PerformanceMetrics => {
  const metrics: PerformanceMetrics = {};

  // First Contentful Paint
  if ('PerformanceObserver' in window) {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });
  }

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.largestContentfulPaint = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // First Input Delay
  if ('PerformanceObserver' in window) {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.firstInputDelay = entry.processingStart - entry.startTime;
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  // Cumulative Layout Shift
  if ('PerformanceObserver' in window) {
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      metrics.cumulativeLayoutShift = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  return metrics;
};

/**
 * Optimize images for better performance
 */
export const optimizeImages = (): void => {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading="lazy" for images below the fold
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
};

/**
 * Initialize performance optimizations
 */
export const initializePerformanceOptimizations = (): void => {
  // Add resource hints
  preconnectExternalDomains();
  preloadCriticalAssets();
  
  // Optimize images
  optimizeImages();
  
  // Monitor Core Web Vitals
  const metrics = monitorCoreWebVitals();
  
  // Log performance metrics for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metrics:', metrics);
  }
  
  // Send metrics to analytics (if configured)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        (window as any).gtag('event', 'web_vitals', {
          metric_name: key,
          metric_value: value,
          metric_id: `${key}_${Date.now()}`
        });
      }
    });
  }
};

/**
 * Handle loading states and fallbacks
 */
export const handleLoadingStates = (): void => {
  // Hide loading screen when app is ready
  const hideLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    const prerenderedContent = document.getElementById('prerendered-content');
    
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    
    if (prerenderedContent) {
      prerenderedContent.style.display = 'none';
    }
  };

  // Show fallback content if app fails to load
  const showFallbackContent = () => {
    const prerenderedContent = document.getElementById('prerendered-content');
    if (prerenderedContent) {
      prerenderedContent.style.display = 'flex';
    }
  };

  // Set up error handling
  window.addEventListener('error', (e) => {
    console.error('Application error:', e);
    showFallbackContent();
  });

  // Set up unhandled promise rejection handling
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e);
    showFallbackContent();
  });

  // Export functions for use in components
  (window as any).hideLoadingScreen = hideLoadingScreen;
  (window as any).showFallbackContent = showFallbackContent;
};

/**
 * Optimize bundle loading
 */
export const optimizeBundleLoading = (): void => {
  // Preload critical routes
  const criticalRoutes = ['/dashboard', '/features', '/blog'];
  
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

/**
 * Initialize all performance optimizations
 */
export const initializeAllOptimizations = (): void => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializePerformanceOptimizations();
      handleLoadingStates();
      optimizeBundleLoading();
    });
  } else {
    initializePerformanceOptimizations();
    handleLoadingStates();
    optimizeBundleLoading();
  }
};

export default {
  addResourceHints,
  preloadCriticalAssets,
  preconnectExternalDomains,
  monitorCoreWebVitals,
  optimizeImages,
  initializePerformanceOptimizations,
  handleLoadingStates,
  optimizeBundleLoading,
  initializeAllOptimizations
}; 