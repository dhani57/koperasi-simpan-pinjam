<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $role = auth()->user()->role;
        $stats = [];
        
        $totalMembers = \App\Models\User::where('role', 'anggota')->count();
        $totalSavings = \App\Models\User::sum('total_saving_balance');
        $totalActiveLoans = \App\Models\Loan::whereIn('status', ['aktif', 'disetujui'])->sum('principal_amount');
        
        // Data base on role
        if ($role === 'pengurus') {
            $stats['total_members'] = $totalMembers;
            $stats['pending_verification'] = \App\Models\Loan::where('status', 'diajukan')->count();
            // Job queue check could check jobs or failed_jobs table, mock for now
            $stats['job_queue_status'] = 'OK';
        } elseif ($role === 'bendahara') {
            $stats['total_savings'] = $totalSavings;
            $stats['total_active_loans'] = $totalActiveLoans;
            $stats['pending_approval'] = \App\Models\Loan::where('status', 'diajukan')->count(); // For bendahara approval
            $stats['disbursement_this_month'] = \App\Models\Loan::where('status', 'disetujui')
                ->whereMonth('updated_at', now()->month)
                ->sum('principal_amount');
            // Mock progress potongan
            $stats['deduction_progress'] = 85; 
        } elseif ($role === 'ketua') {
            $stats['total_assets'] = $totalSavings + $totalActiveLoans;
            $stats['total_active_loans'] = $totalActiveLoans;
            $stats['total_shu_expected'] = 2150000; // Mock SHU for now
            $stats['pending_executive_approval'] = \App\Models\Loan::where('status', 'disetujui')->count(); 
        } elseif ($role === 'pengawas') {
            $stats['total_transactions'] = \App\Models\Mutation::whereMonth('created_at', now()->month)->count();
            $stats['failed_deductions'] = \App\Models\DeductionDetail::where('status', 'gagal')->count();
            $stats['pending_recalculation'] = 0; // Mock
        }

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
            'stats' => $stats,
            'chartData' => $chartData
        ]);
    }
}
