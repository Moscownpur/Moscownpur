import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig } from '../config/seo';

export const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSEOConfig(location.pathname);
    const currentUrl = `https://www.moscownpur.in${location.pathname}`;

    // Update structured data if component is available
    const updateStructuredData = () => {
      const existingScript = document.querySelector('script[data-structured-data]');
      if (existingScript) {
        existingScript.remove();
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": seo.structuredDataType || "WebApplication",
        "name": seo.title,
        "description": seo.description,
        "url": currentUrl,
        "image": seo.image || "https://www.moscownpur.in/og-image.png",
        "author": {
          "@type": "Organization",
          "name": "MosCownpur",
          "url": "https://www.moscownpur.in"
        },
        "publisher": {
          "@type": "Organization",
          "name": "MosCownpur",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.moscownpur.in/og-image.png"
          }
        },
        "inLanguage": "en-US",
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0]
      };

      // Add WebApplication specific properties
      if (seo.structuredDataType === 'WebApplication') {
        Object.assign(structuredData, {
          "applicationCategory": "CreativeApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "screenshot": seo.image || "https://www.moscownpur.in/og-image.png",
          "featureList": [
            "World Building",
            "Character Management", 
            "Timeline Events",
            "Story Creation",
            "Scene Management",
            "Chapter Organization"
          ],
          "keywords": seo.keywords
        });
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    };

    // Update structured data
    updateStructuredData();

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