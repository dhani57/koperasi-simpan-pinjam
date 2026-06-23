<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! $request->user()) {
            abort(403, 'Unauthorized action.');
        }

        $hasRole = false;
        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                $hasRole = true;
                break;
            }
        }

        if (! $hasRole) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
