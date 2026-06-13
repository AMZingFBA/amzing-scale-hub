import { useEffect } from 'react';

/**
 * Injects <meta name="robots" content="noindex, nofollow"> on mount
 * and removes it on unmount. Use on utility pages (auth, account,
 * support, internal forms) that must NOT appear in Google.
 */
const NoIndex = () => {
  useEffect(() => {
    // Remove any pre-existing robots meta (e.g. set by SEO.tsx)
    const existing = document.querySelectorAll('meta[name="robots"]');
    existing.forEach((el) => el.remove());

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    meta.setAttribute('content', 'noindex, nofollow');
    meta.setAttribute('data-noindex-helper', 'true');
    document.head.appendChild(meta);

    return () => {
      const el = document.querySelector('meta[data-noindex-helper="true"]');
      if (el) el.remove();
    };
  }, []);

  return null;
};

export default NoIndex;
