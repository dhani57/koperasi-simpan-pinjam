<?php

namespace App\Services;

use App\Models\Mutation;
use App\Models\Setting;
use App\Models\User;

class ShuService
{
    /**
     * Menghitung estimasi SHU dalam Rupiah untuk seluruh anggota (PRD 6.3).
     * 
     * @param string $year
     * @return array
     */
    public function calculateEstimatedShu(string $year): array
    {
        $formulaBase = Setting::where('key', 'shu_formula_base')->value('value') ?? 'total_jasa_pinjaman';

        // Global Totals
        $totalGlobalJasa = Mutation::whereYear('created_at', $year)
            ->where('type', 'angsuran_jasa')
            ->sum('amount');

        $totalGlobalSimpanan = Mutation::whereIn('type', ['simpanan_rutin', 'simpanan_pokok', 'simpanan_sukarela'])
            ->sum('amount');

        // Asumsi Profit: Keuntungan koperasi adalah total jasa pinjaman yang terkumpul
        $globalProfit = $totalGlobalJasa;
        
        // Asumsi alokasi SHU untuk anggota adalah 70% dari profit
        $totalShuDibagikan = $globalProfit * 0.7;

        // Distribusi: 40% berdasarkan porsi simpanan, 60% berdasarkan porsi pinjaman
        $porsiSimpananPool = $totalShuDibagikan * 0.4;
        $porsiJasaPool = $totalShuDibagikan * 0.6;

        $members = User::where('role', 'anggota')->get();
        $proportions = [];
        $totalScore = 0; // for backwards compatibility if needed, but we'll use nominals

        foreach ($members as $member) {
            $totalSimpananAkumulasi = Mutation::where('user_id', $member->id)
                ->whereIn('type', ['simpanan_rutin', 'simpanan_pokok', 'simpanan_sukarela'])
                ->sum('amount');

            $totalJasaPinjaman = Mutation::where('user_id', $member->id)
                ->whereYear('created_at', $year)
                ->where('type', 'angsuran_jasa')
                ->sum('amount');

            $porsiSimpanan = $totalGlobalSimpanan > 0 ? ($totalSimpananAkumulasi / $totalGlobalSimpanan) * $porsiSimpananPool : 0;
            $porsiPinjaman = $totalGlobalJasa > 0 ? ($totalJasaPinjaman / $totalGlobalJasa) * $porsiJasaPool : 0;
            
            $totalShu = $porsiSimpanan + $porsiPinjaman;
            $persenBagian = $totalShuDibagikan > 0 ? ($totalShu / $totalShuDibagikan) * 100 : 0;

            $proportions[] = [
                'user' => $member,
                'score' => $totalJasaPinjaman, // keeping 'score' as jasa for compatibility
                'proportion_percentage' => $persenBagian,
                'nominal_shu' => round($totalShu),
                'porsi_simpanan' => round($porsiSimpanan),
                'porsi_pinjaman' => round($porsiPinjaman),
                'total_simpanan_akumulasi' => $totalSimpananAkumulasi,
                'total_jasa_pinjaman' => $totalJasaPinjaman,
            ];
            
            $totalScore += $totalJasaPinjaman;
        }

        // Sort by highest nominal SHU
        usort($proportions, fn($a, $b) => $b['nominal_shu'] <=> $a['nominal_shu']);

        return [
            'total_score' => $totalScore, // Total Jasa
            'formula_base' => $formulaBase,
            'total_shu_dibagikan' => $totalShuDibagikan,
            'total_global_jasa' => $totalGlobalJasa,
            'total_global_simpanan' => $totalGlobalSimpanan,
            'member_proportions' => $proportions,
        ];
    }

    /**
     * Mengambil estimasi SHU untuk satu user tertentu.
     */
    public function calculateEstimatedShuForUser(string $year, $userId): array
    {
        $allData = $this->calculateEstimatedShu($year);
        
        $memberData = collect($allData['member_proportions'])->firstWhere('user.id', $userId);
        
        if (!$memberData) {
            return [
                'totalShu' => 0,
                'porsiSimpanan' => 0,
                'porsiPinjaman' => 0,
                'persenKontribusiAset' => 0,
                'totalSimpananAkumulasi' => 0,
                'totalJasaPinjaman' => 0,
            ];
        }

        $persenKontribusiAset = $allData['total_global_simpanan'] > 0 
            ? round(($memberData['total_simpanan_akumulasi'] / $allData['total_global_simpanan']) * 100, 2) 
            : 0;

        return [
            'totalShu' => $memberData['nominal_shu'],
            'porsiSimpanan' => $memberData['porsi_simpanan'],
            'porsiPinjaman' => $memberData['porsi_pinjaman'],
            'persenKontribusiAset' => $persenKontribusiAset,
            'totalSimpananAkumulasi' => $memberData['total_simpanan_akumulasi'],
            'totalJasaPinjaman' => $memberData['total_jasa_pinjaman'],
        ];
    }
}
