'use client';

import { useEffect } from 'react';

export function GlobalPrefetchPrevention() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Intercept fetch requests to block RSC prefetches
      const originalFetch = window.fetch;
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input instanceof Request ? input.url : '';
        
        // Block ALL RSC prefetch requests
        if (url.includes('_rsc=')) {
          console.log('Blocked RSC prefetch:', url);
          return Promise.reject(new Error('RSC prefetch blocked'));
        }
        
        return originalFetch.apply(this, [input, init as RequestInit]);
      };
      
      // Block IntersectionObserver which triggers prefetching
      const OriginalIntersectionObserver = window.IntersectionObserver;
      
      // Store the original constructor but use a class replacement
      // @ts-ignore - We need to override the constructor this way
      window.IntersectionObserver = class extends OriginalIntersectionObserver {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          // If this is related to prefetching (rootMargin is very large), create a no-op observer
          if (options && options.rootMargin && options.rootMargin.includes('200px')) {
            super((entries) => {}, options);
            // Override all methods to do nothing
            this.observe = () => {};
            this.unobserve = () => {};
            this.disconnect = () => {};
            return;
          }
          
          // For other intersection observers, wrap the callback
          const wrappedCallback: IntersectionObserverCallback = (entries, observer) => {
            // Block all prefetching
            const filteredEntries = entries.filter(entry => {
              const target = entry.target as HTMLElement;
              const linkElem = target.tagName === 'LINK' || !!target.closest?.('a[href]');
              const href = target.getAttribute?.('href') || (target.dataset ? target.dataset.href : undefined);
              
              // Don't trigger prefetching for any route
              if (linkElem && href) {
                return false; // Block all link prefetching
              }
              
              return true;
            });
            
            if (filteredEntries.length > 0) {
              callback(filteredEntries, observer);
            }
          };
          
          super(wrappedCallback, options);
        }
      };
      
      // Also override the Next.js router directly to block prefetching
      const checkAndOverrideRouter = () => {
        const nextData = document.getElementById('__NEXT_DATA__');
        if (nextData && (window as any)['next']?.['router']?.['prefetch']) {
          const originalPrefetch = (window as any)['next']['router']['prefetch'];
          (window as any)['next']['router']['prefetch'] = () => Promise.resolve();
          return originalPrefetch;
        }
        return null;
      };
      
      const originalPrefetch = checkAndOverrideRouter();
      const interval = setInterval(checkAndOverrideRouter, 1000);
      
      return () => {
        // Restore original functions when component unmounts
        window.fetch = originalFetch;
        window.IntersectionObserver = OriginalIntersectionObserver;
        clearInterval(interval);
        
        // Restore original prefetch if it was replaced
        const nextData = document.getElementById('__NEXT_DATA__');
        if (originalPrefetch && nextData && (window as any)['next']?.['router']) {
          (window as any)['next']['router']['prefetch'] = originalPrefetch;
        }
      };
    }
  }, []);

  return null;
}
