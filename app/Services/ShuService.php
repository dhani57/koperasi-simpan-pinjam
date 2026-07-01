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
        $shuPeriod = \App\Models\ShuPeriod::where('year', $year)->first();

        // Default percentages if no period is set yet (PRD default: 70% for anggota, split 40/60)
        // 40% of 70% = 28% (0.28), 60% of 70% = 42% (0.42)
        $persenSimpanan = $shuPeriod ? ($shuPeriod->persen_shu_simpanan / 100) : 0.28;
        $persenJasa = $shuPeriod ? ($shuPeriod->persen_shu_jasa / 100) : 0.42;
        $persenTotalAnggota = $persenSimpanan + $persenJasa; // For display purposes

        // Global Totals
        $totalGlobalJasa = Mutation::whereYear('created_at', $year)
            ->where('type', 'angsuran_jasa')
            ->sum('amount');

        $totalGlobalSimpanan = Mutation::whereIn('type', ['simpanan_rutin', 'simpanan_wajib', 'simpanan_pokok', 'simpanan_sukarela', 'simpanan'])
            ->sum('amount');

        // Asumsi Profit: Keuntungan koperasi adalah total jasa pinjaman yang terkumpul
        $globalProfit = $shuPeriod ? $shuPeriod->total_jasa_income : $totalGlobalJasa;
        
        $totalShuDibagikan = $globalProfit * $persenTotalAnggota;

        $porsiSimpananPool = $globalProfit * $persenSimpanan;
        $porsiJasaPool = $globalProfit * $persenJasa;

        $members = User::where('role', 'anggota')->get();
        $proportions = [];
        $totalScore = 0; // for backwards compatibility if needed, but we'll use nominals

        foreach ($members as $member) {
            $totalSimpananAkumulasi = Mutation::where('user_id', $member->id)
                ->whereIn('type', ['simpanan_rutin', 'simpanan_wajib', 'simpanan_pokok', 'simpanan_sukarela', 'simpanan'])
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
