<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || !in_array($request->user()->role, ['pengurus', 'bendahara', 'ketua', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
