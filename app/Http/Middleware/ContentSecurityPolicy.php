<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Required headers from mandatory-secure-web-skills
        $csp = "default-src 'self'; ";
        // unsafe-inline and unsafe-eval are often needed for Vite/React dev server.
        $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ";
        $csp .= "style-src 'self' 'unsafe-inline' https://fonts.bunny.net https://fonts.googleapis.com; ";
        $csp .= "font-src 'self' https://fonts.bunny.net https://fonts.gstatic.com; ";
        $csp .= "img-src 'self' data: https: http:; ";
        $csp .= "frame-ancestors 'self'; ";
        $csp .= "object-src 'none';";

        $response->headers->set('Content-Security-Policy', $csp);
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}
