<?php

namespace App\Services;

use App\Models\Mutation;
use App\Models\Setting;
use App\Models\User;

class ShuService
{
    /**
     * Menghitung porsi aktivitas tiap anggota berdasarkan total mutasi dalam periode tertentu.
     * Ini adalah kerangka untuk mengimplementasikan formula pembagian SHU (PRD 6.3).
     * 
     * @param string $year
     * @return array
     */
    public function calculateActivityProportions(string $year): array
    {
        $formulaBase = Setting::where('key', 'shu_formula_base')->value('value') ?? 'total_mutation_amount';

        $members = User::where('role', 'anggota')->get();
        $scores = [];
        $totalScore = 0;

        foreach ($members as $member) {
            $mutations = Mutation::where('user_id', $member->id)
                ->whereYear('created_at', $year)
                ->whereIn('type', ['angsuran_jasa', 'angsuran_pokok', 'pencairan_pinjaman'])
                ->get();
            
            $score = 0;
            if ($formulaBase === 'total_mutation_amount') {
                $score = $mutations->sum('amount');
            } elseif ($formulaBase === 'total_mutation_frequency') {
                $score = $mutations->count();
            }

            $scores[$member->id] = $score;
            $totalScore += $score;
        }

        $proportions = [];
        foreach ($members as $member) {
            $proportion = $totalScore > 0 ? ($scores[$member->id] / $totalScore) : 0;
            $proportions[] = [
                'user' => $member,
                'score' => $scores[$member->id],
                'proportion_percentage' => $proportion * 100,
            ];
        }

        // Sort by highest proportion
        usort($proportions, fn($a, $b) => $b['proportion_percentage'] <=> $a['proportion_percentage']);

        return [
            'total_score' => $totalScore,
            'formula_base' => $formulaBase,
            'member_proportions' => $proportions,
        ];
    }
}
