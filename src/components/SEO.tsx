import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object;
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords,
  image = 'https://amzingfba.com/amzing-logo-checkout.png',
  type = 'website',
  schema,
  noindex = false,
}: SEOProps) => {
  const location = useLocation();
  const url = `https://amzingfba.com${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);

    // Robots meta
    if (noindex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', url, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', type, true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // JSON-LD Schema
    if (schema) {
      const existingSchema = document.querySelector('script[data-dynamic-schema]');
      if (existingSchema) {
        existingSchema.remove();
      }

      const schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('data-dynamic-schema', 'true');
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    return () => {
      // Cleanup dynamic schema on unmount
      const dynamicSchema = document.querySelector('script[data-dynamic-schema]');
      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, keywords, image, type, url, schema, noindex]);

  return null;
};

export default SEO;
