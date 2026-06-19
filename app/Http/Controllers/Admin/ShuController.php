<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShuController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'bendahara') {
            abort(403, 'Unauthorized action.');
        }

        // Just display a page to trigger SHU
        return inertia('Admin/Shu/Index');
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'bendahara') {
            abort(403, 'Unauthorized action.');
        }

        // Simulate SHU generation
        // In a real application, this would calculate profits based on loans, settings, and distribute to members
        // For now, we will just return a success message.
        
        // This process might take a long time, so it should ideally be queued.
        // \App\Jobs\CalculateShuJob::dispatch();
        
        return redirect()->back()->with('success', 'Proses perhitungan dan distribusi SHU sedang berjalan di latar belakang.');
    }
}
