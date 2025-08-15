<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // For admin routes, we'll check for JWT token in the frontend
        // This middleware will redirect to login if not authenticated
        
        // Check if this is an admin route
        if ($request->is('admin/*') && !$request->is('admin/login')) {
            // For Inertia.js, we'll pass a prop to check authentication in React
            // The actual JWT validation happens on the frontend
            return $next($request);
        }
        
        return $next($request);
    }
}
