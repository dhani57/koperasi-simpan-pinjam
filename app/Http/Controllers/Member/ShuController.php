<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShuController extends Controller
{
    public function index()
    {
        $year = now()->year;
        $user = auth()->user();

        // 1. Total Simpanan Akumulasi (all time)
        $totalSimpananAkumulasi = \App\Models\Mutation::where('user_id', $user->id)
            ->whereIn('type', ['simpanan_rutin', 'simpanan_pokok', 'simpanan_sukarela'])
            ->sum('amount');

        // 2. Total Jasa Pinjaman (this year)
        $totalJasaPinjaman = \App\Models\Mutation::where('user_id', $user->id)
            ->whereYear('created_at', $year)
            ->where('type', 'angsuran_jasa')
            ->sum('amount');

        // Global Totals
        $totalGlobalJasa = \App\Models\Mutation::whereYear('created_at', $year)
            ->where('type', 'angsuran_jasa')
            ->sum('amount');

        $totalGlobalSimpanan = \App\Models\Mutation::whereIn('type', ['simpanan_rutin', 'simpanan_pokok', 'simpanan_sukarela'])
            ->sum('amount');

        // Asumsi Profit: Keuntungan koperasi adalah total jasa pinjaman yang terkumpul
        $globalProfit = $totalGlobalJasa;
        
        // Asumsi alokasi SHU untuk anggota adalah 70% dari profit
        $totalShuDibagikan = $globalProfit * 0.7;

        // Distribusi: 40% berdasarkan porsi simpanan, 60% berdasarkan porsi pinjaman
        $porsiSimpananPool = $totalShuDibagikan * 0.4;
        $porsiJasaPool = $totalShuDibagikan * 0.6;

        $porsiSimpanan = $totalGlobalSimpanan > 0 ? ($totalSimpananAkumulasi / $totalGlobalSimpanan) * $porsiSimpananPool : 0;
        $porsiPinjaman = $totalGlobalJasa > 0 ? ($totalJasaPinjaman / $totalGlobalJasa) * $porsiJasaPool : 0;

        $totalShu = $porsiSimpanan + $porsiPinjaman;
        $persenKontribusiAset = $totalGlobalSimpanan > 0 ? round(($totalSimpananAkumulasi / $totalGlobalSimpanan) * 100, 2) : 0;

        return inertia('Member/Shu/Index', [
            'totalShu' => round($totalShu),
            'porsiSimpanan' => round($porsiSimpanan),
            'porsiPinjaman' => round($porsiPinjaman),
            'persenKontribusiAset' => $persenKontribusiAset,
            'totalSimpananAkumulasi' => $totalSimpananAkumulasi,
            'totalJasaPinjaman' => $totalJasaPinjaman,
            'tahunBuku' => $year
        ]);
    }
}
