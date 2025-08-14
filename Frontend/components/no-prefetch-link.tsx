import Link from 'next/link';
import { ComponentProps } from 'react';

interface NoPrefetchLinkProps extends Omit<ComponentProps<typeof Link>, 'prefetch'> {
  children: React.ReactNode;
}

/**
 * A Link component that completely disables prefetching
 * for static export compatibility
 */
export function NoPrefetchLink({ children, ...props }: NoPrefetchLinkProps) {
  return (
    <Link 
      {...props} 
      prefetch={false}
      onMouseEnter={(e) => {
        // Prevent any hover prefetching
        e.preventDefault();
      }}
      onFocus={(e) => {
        // Prevent focus prefetching
        e.preventDefault();
      }}
    >
      {children}
    </Link>
  );
}
