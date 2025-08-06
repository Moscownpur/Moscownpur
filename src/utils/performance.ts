// Performance utilities for better loading and monitoring

export const preloadComponent = (importFn: () => Promise<any>) => {
  // Start preloading the component
  const promise = importFn();
  
  // Return a component that uses the preloaded promise
  return () => promise.then((module) => module.default);
};

export const measurePerformance = (name: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });
  }
  return null;
};

// Resource hints for better loading
export const addResourceHint = (href: string, rel: string) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
}; 