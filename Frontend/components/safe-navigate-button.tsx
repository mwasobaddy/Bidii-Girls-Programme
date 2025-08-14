'use client';

import { useRouter } from 'next/navigation';
import { ComponentProps } from 'react';

interface SafeNavigateButtonProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A button that navigates safely without prefetching
 * for static export compatibility
 */
export function SafeNavigateButton({ href, children, className, ...props }: SafeNavigateButtonProps) {
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if the route exists in our static export
    const isDynamicRoute = /\/(campaigns|projects|blog)\/\d+/.test(href);
    
    if (isDynamicRoute) {
      // For dynamic routes that don't exist in static export, 
      // redirect to the list page instead
      const baseRoute = href.match(/\/(campaigns|projects|blog)/)?.[1];
      if (baseRoute) {
        router.push(`/${baseRoute}`);
        return;
      }
    }
    
    // For normal routes, navigate normally
    router.push(href);
  };

  return (
    <button
      {...props}
      className={className}
      onClick={handleNavigation}
      type="button"
    >
      {children}
    </button>
  );
}
