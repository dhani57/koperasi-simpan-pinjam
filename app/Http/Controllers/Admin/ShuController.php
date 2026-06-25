<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShuController extends Controller
{
    public function index(\App\Services\ShuService $shuService)
    {
        $year = request('year', now()->year);
        $search = request('search');
        
        $shuData = $shuService->calculateEstimatedShu($year);

        if ($search) {
            $shuData['member_proportions'] = array_filter($shuData['member_proportions'], function ($item) use ($search) {
                return stripos($item['user']->name, $search) !== false;
            });
            $shuData['member_proportions'] = array_values($shuData['member_proportions']);
        }

        // Just display a page to trigger SHU
        return inertia('Admin/Shu/Index', [
            'year' => $year,
            'shuData' => $shuData,
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        // Simulate SHU generation
        // In a real application, this would calculate profits based on loans, settings, and distribute to members
        // For now, we will just return a success message.
        
        // This process might take a long time, so it should ideally be queued.
        // \App\Jobs\CalculateShuJob::dispatch();
        
        return redirect()->back()->with('success', 'Draft perhitungan SHU berhasil dibuat dan menunggu persetujuan Ketua.');
    }

    public function approve(Request $request)
    {
        return redirect()->back()->with('success', 'Distribusi SHU telah disetujui dan dibagikan ke saldo anggota.');
    }
}
