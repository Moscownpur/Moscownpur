import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig } from '../config/seo';

export const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSEOConfig(location.pathname);
    const currentUrl = `https://www.moscownpur.in${location.pathname}`;

    // Update document title
    document.title = seo.title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Primary meta tags
    updateMetaTag('title', seo.title);
    updateMetaTag('description', seo.description);
    updateMetaTag('keywords', seo.keywords);

    // Open Graph tags
    updateMetaTag('og:type', seo.type || 'website', true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:title', seo.title, true);
    updateMetaTag('og:description', seo.description, true);
    if (seo.image) {
      updateMetaTag('og:image', seo.image, true);
    }
    updateMetaTag('og:site_name', 'MosCownpur', true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', currentUrl, true);
    updateMetaTag('twitter:title', seo.title, true);
    updateMetaTag('twitter:description', seo.description, true);
    if (seo.image) {
      updateMetaTag('twitter:image', seo.image, true);
    }

  }, [location.pathname]);
}; 