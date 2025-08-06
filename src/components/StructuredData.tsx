import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface StructuredDataProps {
  type?: 'WebApplication' | 'WebSite' | 'Organization' | 'Article';
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'WebApplication',
  title = 'MosCownpur - Fictional Universe Management App',
  description = 'Create, manage, and explore fictional universes with MosCownpur. Build worlds, characters, timelines, and stories with our comprehensive universe management platform.',
  image = 'https://www.moscownpur.in/og-image.png',
  url,
  author = 'MosCownpur',
  datePublished = '2024-01-01',
  dateModified = new Date().toISOString().split('T')[0]
}) => {
  const location = useLocation();
  const currentUrl = url || `https://www.moscownpur.in${location.pathname}`;

  useEffect(() => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[data-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create base structured data
    let structuredData: any = {
      "@context": "https://schema.org",
      "@type": type,
      "name": title,
      "description": description,
      "url": currentUrl,
      "image": image,
      "author": {
        "@type": "Organization",
        "name": author,
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
      "datePublished": datePublished,
      "dateModified": dateModified
    };

    // Add type-specific properties
    if (type === 'WebApplication') {
      structuredData = {
        ...structuredData,
        "applicationCategory": "CreativeApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "screenshot": image,
        "featureList": [
          "World Building",
          "Character Management", 
          "Timeline Events",
          "Story Creation",
          "Scene Management",
          "Chapter Organization"
        ],
        "keywords": "fictional universe, world building, character management, story creation, timeline events, creative writing, universe management"
      };
    } else if (type === 'WebSite') {
      structuredData = {
        ...structuredData,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.moscownpur.in/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      };
    } else if (type === 'Article') {
      structuredData = {
        ...structuredData,
        "headline": title,
        "articleBody": description,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        }
      };
    }

    // Create and append the script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[data-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, title, description, image, currentUrl, author, datePublished, dateModified]);

  return null; // This component doesn't render anything
};

export default StructuredData; 