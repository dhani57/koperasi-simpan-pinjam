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

        $viteDevServer = app()->environment('local') ? 'http://localhost:5173 ws://localhost:5173 http://localhost:5174 ws://localhost:5174 http://0.0.0.0:5173 ws://0.0.0.0:5173 http://0.0.0.0:5174 ws://0.0.0.0:5174' : '';

        // Required headers from mandatory-secure-web-skills
        $csp = "default-src 'self' $viteDevServer; ";
        // unsafe-inline and unsafe-eval are often needed for Vite/React dev server.
        $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval' $viteDevServer; ";
        $csp .= "style-src 'self' 'unsafe-inline' https://fonts.bunny.net https://fonts.googleapis.com $viteDevServer; ";
        $csp .= "font-src 'self' https://fonts.bunny.net https://fonts.gstatic.com; ";
        $csp .= "img-src 'self' data: https: http:; ";
        $csp .= "connect-src 'self' $viteDevServer; ";
        $csp .= "frame-ancestors 'self'; ";
        $csp .= "object-src 'none';";

        $response->headers->set('Content-Security-Policy', $csp);
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}
