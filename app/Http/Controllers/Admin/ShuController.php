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

        $isDistributed = \App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists();
        $hasDraft = \App\Models\Setting::where('key', 'shu_draft_' . $year)->exists();

        // Just display a page to trigger SHU
        return inertia('Admin/Shu/Index', [
            'year' => $year,
            'shuData' => $shuData,
            'filters' => ['search' => $search],
            'isDistributed' => $isDistributed,
            'hasDraft' => $hasDraft
        ]);
    }

    public function store(Request $request)
    {
        $year = $request->query('year', now()->year);

        if (\App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists()) {
            return redirect()->back()->with('error', "SHU tahun {$year} telah didistribusikan.");
        }

        if (\App\Models\Setting::where('key', 'shu_draft_' . $year)->exists()) {
            return redirect()->back()->with('error', "Draf SHU tahun {$year} sudah dikirim.");
        }

        \App\Models\Setting::updateOrCreate(
            ['key' => 'shu_draft_' . $year],
            ['value' => '1']
        );

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'shu_generated',
            "Membuat draft perhitungan SHU tahun {$year}"
        );
        
        return redirect()->back()->with('success', 'Draft perhitungan SHU berhasil dibuat dan menunggu persetujuan Ketua.');
    }

    public function approve(Request $request)
    {
        $year = $request->query('year', now()->year);

        if (\App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists()) {
            return redirect()->back()->with('error', "SHU tahun {$year} telah didistribusikan.");
        }

        \App\Models\Setting::updateOrCreate(
            ['key' => 'shu_distributed_' . $year],
            ['value' => '1']
        );

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'shu_approved',
            "Menyetujui distribusi SHU tahun {$year}"
        );
        return redirect()->back()->with('success', 'Distribusi SHU telah disetujui dan dibagikan ke saldo anggota.');
    }
}
