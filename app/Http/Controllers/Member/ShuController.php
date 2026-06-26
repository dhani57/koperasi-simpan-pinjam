<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShuController extends Controller
{
    public function index(\App\Services\ShuService $shuService)
    {
        $year = now()->year;
        $user = auth()->user();

        // Gunakan layanan sentral untuk perhitungan SHU
        $shuData = $shuService->calculateEstimatedShuForUser($year, $user->id);
        
        $isDistributed = \App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists();

        return inertia('Member/Shu/Index', [
            'totalShu' => $shuData['totalShu'],
            'porsiSimpanan' => $shuData['porsiSimpanan'],
            'porsiPinjaman' => $shuData['porsiPinjaman'],
            'persenKontribusiAset' => $shuData['persenKontribusiAset'],
            'totalSimpananAkumulasi' => $shuData['totalSimpananAkumulasi'],
            'totalJasaPinjaman' => $shuData['totalJasaPinjaman'],
            'tahunBuku' => $year,
            'isDistributed' => $isDistributed,
        ]);
    }
}
