'use client';

import { useEffect } from 'react';

export function DisablePrefetching() {
  useEffect(() => {
    // Disable prefetching by removing prefetch links for dynamic routes
    if (typeof window !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const links = document.querySelectorAll('link[rel="prefetch"]');
            links.forEach((link) => {
              const href = link.getAttribute('href');
              // Remove prefetch links for dynamic routes
              if (href && /\/(campaigns|projects|blog)\/\d+/.test(href)) {
                link.remove();
                console.log('Removed prefetch link:', href);
              }
            });
          }
        });
      });

      observer.observe(document.head, {
        childList: true,
        subtree: true,
      });

      // Also check existing links
      const existingLinks = document.querySelectorAll('link[rel="prefetch"]');
      existingLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && /\/(campaigns|projects|blog)\/\d+/.test(href)) {
          link.remove();
          console.log('Removed existing prefetch link:', href);
        }
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null;
}
