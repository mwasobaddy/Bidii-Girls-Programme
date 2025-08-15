// This script helps with client-side routing for static exports
document.addEventListener('DOMContentLoaded', function() {
  // Extract the current path
  const path = window.location.pathname;
  
  // Check if this is a dynamic route path pattern
  const isDynamicRoute = 
    /^\/campaigns\/\d+\/?$/.test(path) || 
    /^\/projects\/\d+\/?$/.test(path) || 
    /^\/blog\/\d+\/?$/.test(path);
  
  if (isDynamicRoute) {
    // Extract the route type and ID
    const parts = path.split('/').filter(Boolean);
    const routeType = parts[0]; // 'campaigns', 'projects', or 'blog'
    const id = parts[1]; // The numeric ID
    
    // For dynamic routes, we need to navigate using Next.js router
    // This will run after Next.js has initialized
    window.__NEXT_REGISTER_PAGE_PROMISE = new Promise(function(resolve) {
      window.__NEXT_REGISTER_PAGE_RESOLVE = resolve;
      
      // Set a small timeout to ensure Next.js has initialized
      setTimeout(function() {
        console.log(`Handling dynamic route: ${routeType}/${id}`);
        
        // Store the dynamic route info so the app can use it after hydration
        sessionStorage.setItem('dynamic_route_type', routeType);
        sessionStorage.setItem('dynamic_route_id', id);
        
        // If Next.js router is available, use it
        if (window.next && window.next.router && typeof window.next.router.push === 'function') {
          window.next.router.push(`/${routeType}/${id}`);
        } else {
          // Otherwise, we'll let the app handle it after hydration
          console.log('Next.js router not available yet, route will be handled after hydration');
        }
        
        resolve();
      }, 100);
    });
  }
});
