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
        $data = []; // specific data like tables/charts
        
        $totalMembers = \App\Models\User::where('role', 'anggota')->count();
        $totalSavings = \App\Models\User::sum('total_saving_balance');
        $totalActiveLoans = \App\Models\Loan::whereIn('status', ['aktif', 'disetujui'])->sum('principal_amount');
        
        // Base chart data (fallback)
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
        
        if ($role === 'pengurus') {
            $stats['total_members'] = $totalMembers;
            $stats['pending_verification'] = \App\Models\Loan::where('status', 'diajukan')->count();
            $stats['job_queue_status'] = 'Optimal';
            
            // Pertumbuhan Anggota (Mock)
            $data['member_growth'] = collect($months)->map(fn($m) => ['name' => $m, 'Anggota_Baru' => rand(5, 25)]);
            
            // Distribusi Limit (Mock)
            $data['limit_distribution'] = [
                ['name' => '< 30%', 'Jumlah' => 45],
                ['name' => '30% - 50%', 'Jumlah' => 120],
                ['name' => '> 50%', 'Jumlah' => 35],
            ];
            
            // Status Parameter Sistem
            $inactiveMonths = \App\Models\Setting::where('key', 'inactive_months')->value('value') ?? '11,12';
            $data['system_parameters'] = [
                'Bulan Non-Aktif' => $inactiveMonths,
                'Jasa Default' => '1.5% / bulan'
            ];
            
            // Alerts
            $data['alerts'] = [
                ['type' => 'warning', 'message' => '5 anggota mendekati limit potongan gaji (90%+).']
            ];

        } elseif ($role === 'bendahara') {
            $stats['total_savings'] = $totalSavings;
            $stats['total_active_loans'] = $totalActiveLoans;
            $stats['pending_approval'] = \App\Models\Loan::where('status', 'diajukan')->count(); 
            $stats['disbursement_this_month'] = \App\Models\Loan::where('status', 'disetujui')
                ->whereMonth('updated_at', now()->month)
                ->sum('principal_amount');
            $stats['deduction_progress'] = 85; 

            // Approval Queue
            $data['approval_queue'] = \App\Models\Loan::with('user')->where('status', 'diajukan')->take(5)->get();
            
            // Cash Flow
            $data['cash_flow'] = collect($months)->map(fn($m) => ['name' => $m, 'Masuk' => rand(10000000, 50000000), 'Keluar' => rand(5000000, 30000000)]);
            
            // Komposisi Pinjaman
            $data['loan_composition'] = [
                ['name' => 'Aktif', 'value' => 60],
                ['name' => 'Lunas', 'value' => 30],
                ['name' => 'Menunggu', 'value' => 10],
            ];

            $data['alerts'] = [
                ['type' => 'error', 'message' => '2 pemotongan gaji bulan ini gagal. Perlu review manual.']
            ];

        } elseif ($role === 'ketua') {
            $stats['total_assets'] = $totalSavings + $totalActiveLoans;
            $stats['total_active_loans'] = $totalActiveLoans;
            $stats['total_shu_expected'] = 2150000;
            $stats['pending_executive_approval'] = \App\Models\Loan::where('status', 'disetujui')->count(); 

            // Tren Dana
            $data['asset_trend'] = collect($months)->map(fn($m) => ['name' => $m, 'Aset' => rand(100000000, 500000000)]);
            
            // Simpanan vs Pinjaman
            $data['savings_vs_loans'] = collect($months)->map(fn($m) => ['name' => $m, 'Simpanan' => rand(20, 50)*1000000, 'Pinjaman' => rand(10, 30)*1000000]);
            
            // Top Anggota
            $data['top_members'] = \App\Models\User::where('role', 'anggota')->orderBy('total_saving_balance', 'desc')->take(5)->get();
            
            // Approval Tingkat Eksekutif
            $data['executive_approvals'] = \App\Models\Loan::with('user')->whereIn('status', ['disetujui', 'diajukan'])->take(5)->get();
            
            $data['health_score'] = 92; // Gauge
            
        } elseif ($role === 'pengawas') {
            $stats['total_transactions'] = \App\Models\Mutation::whereMonth('created_at', now()->month)->count();
            $stats['failed_deductions'] = 0; // if we have DeductionDetail model, else 0
            $stats['pending_recalculation'] = 0;

            // Log Mutasi
            $data['mutation_logs'] = \App\Models\Mutation::with('user')->orderBy('created_at', 'desc')->take(10)->get();
            
            // Status Rincian
            $data['failed_details'] = []; // Mock
            
            // Tren Transaksi
            $data['transaction_trend'] = collect($months)->map(fn($m) => ['name' => $m, 'Berhasil' => rand(50, 100), 'Gagal' => rand(0, 5)]);
            
            // Riwayat Jasa Tahunan
            $data['annual_services'] = \App\Models\LoanAnnualService::with('loan.user')->take(5)->get() ?? [];
        }

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'roleData' => $data
        ]);
    }
}
