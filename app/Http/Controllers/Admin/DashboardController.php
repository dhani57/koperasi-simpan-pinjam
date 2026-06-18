<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalMembers = \App\Models\User::where('role', 'anggota')->count();
        $totalSavings = \App\Models\User::sum('total_saving_balance');

        // Total Pinjaman Aktif
        $totalActiveLoans = \App\Models\Loan::whereIn('status', ['aktif', 'disetujui'])->sum('principal_amount');

        // Potensi Jasa (Bunga) dari Pinjaman Aktif
        // Perhitungan sederhana: (Angsuran per bulan * Tenor) - Pokok
        $activeLoans = \App\Models\Loan::whereIn('status', ['aktif', 'disetujui'])->get();
        $totalExpectedInterest = $activeLoans->sum(function ($loan) {
            return ($loan->monthly_installment * $loan->tenor_months) - $loan->principal_amount;
        });

        // Mock Data Grafik (6 Bulan Terakhir)
        $chartData = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
        foreach ($months as $month) {
            $chartData[] = [
                'name' => $month,
                'Simpanan' => rand(10000000, 50000000),
                'Pinjaman' => rand(5000000, 30000000),
            ];
        }

        return inertia('Admin/Dashboard', [
            'stats' => [
                'total_members' => $totalMembers,
                'total_savings' => $totalSavings,
                'total_active_loans' => $totalActiveLoans,
                'total_expected_interest' => $totalExpectedInterest,
            ],
            'chartData' => $chartData
        ]);
    }
}
