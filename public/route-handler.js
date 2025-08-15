// route-handler.js - Client-side routing support for static exports
// This script runs before the React app loads and helps with handling direct navigation to dynamic routes

// Execute immediately without waiting for DOMContentLoaded for faster response
(function() {
  // Get the current URL path
  const path = window.location.pathname;
  
  // Check if we're on a dynamic route (campaigns, projects, blog)
  const dynamicRoutePattern = /^\/(campaigns|projects|blog)\/(\d+)\/?$/;
  const match = path.match(dynamicRoutePattern);
  
  if (match) {
    // We're on a dynamic route
    const routeType = match[1]; // campaigns, projects, or blog
    const routeId = match[2];   // The numeric ID
    
    // Store the current route info in localStorage (more persistent than sessionStorage)
    localStorage.setItem('currentDynamicRoute', JSON.stringify({
      type: routeType,
      id: routeId,
      fullPath: path,
      timestamp: Date.now() // Add timestamp to differentiate from older entries
    }));
    
    console.log(`Dynamic route detected and saved: ${routeType}/${routeId}`);
    
    // Add an event for the React app to detect
    window.__DYNAMIC_ROUTE_DETECTED__ = true;
  }
})();

// Add additional handling after the page fully loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if we need to handle a dynamic route
  const storedRoute = localStorage.getItem('currentDynamicRoute');
  
  if (storedRoute) {
    try {
      const routeData = JSON.parse(storedRoute);
      // Only process if the stored route is fresh (within the last 5 seconds)
      if (Date.now() - routeData.timestamp < 5000) {
        console.log(`Processing dynamic route: ${routeData.type}/${routeData.id}`);
        
        // Expose this data to the global window object for React to access
        window.__NEXT_DYNAMIC_ROUTE__ = routeData;
        
        // Dispatch a custom event that the React app can listen for
        window.dispatchEvent(new CustomEvent('dynamicRouteReady', { 
          detail: routeData 
        }));
      }
    } catch (e) {
      console.error('Error processing dynamic route:', e);
    }
  }
});
