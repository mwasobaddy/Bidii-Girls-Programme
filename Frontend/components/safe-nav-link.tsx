'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface SafeNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

export function SafeNavLink({ 
  href, 
  children, 
  className = '', 
  activeClassName = '', 
  onClick 
}: SafeNavLinkProps) {
  const router = useRouter();
  
  // Check if it's a dynamic route
  const isDynamicRoute = 
    href.match(/^\/campaigns\/\d+\/?$/) || 
    href.match(/^\/projects\/\d+\/?$/) || 
    href.match(/^\/blog\/\d+\/?$/);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) onClick();
    
    // Use router for all navigation
    router.push(href);
  };
  
  return (
    <Link 
      href={href}
      className={`${className} ${activeClassName}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
