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
        $data = []; 
        
        $totalMembers = \App\Models\User::where('role', 'anggota')->count();
        $totalSavings = \App\Models\User::sum('total_saving_balance');
        $totalActiveLoans = \App\Models\Loan::whereIn('status', ['aktif', 'disetujui'])->sum('current_remaining_principal');
        
        if ($role === 'pengurus') {
            $stats['total_members'] = $totalMembers;
            $stats['pending_verification'] = \App\Models\Loan::where('status', 'diajukan')->count();
            $stats['job_queue_status'] = 'Optimal';
            
            // Pertumbuhan Anggota
            $memberGrowth = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $count = \App\Models\User::where('role', 'anggota')
                    ->whereYear('joined_at', $date->year)
                    ->whereMonth('joined_at', $date->month)
                    ->count();
                $memberGrowth->push(['name' => $date->translatedFormat('M'), 'Anggota_Baru' => $count]);
            }
            $data['member_growth'] = $memberGrowth;
            
            // Distribusi Limit
            $users = \App\Models\User::where('role', 'anggota')->with(['loans' => function($q) {
                $q->whereIn('status', ['disetujui', 'aktif']);
            }])->get();
            
            $dist = ['< 30%' => 0, '30% - 50%' => 0, '> 50%' => 0];
            foreach($users as $user) {
                $loanInstallments = $user->loans->sum(function($l) { return $l->monthly_principal_installment + $l->current_year_monthly_fee; });
                $used = $user->monthly_saving_nominal + $loanInstallments;
                $limit = $user->max_salary_deduction_limit;
                $pct = $limit > 0 ? ($used / $limit) * 100 : 0;
                if ($pct < 30) $dist['< 30%']++;
                elseif ($pct <= 50) $dist['30% - 50%']++;
                else $dist['> 50%']++;
            }
            $data['limit_distribution'] = [
                ['name' => '< 30%', 'Jumlah' => $dist['< 30%']],
                ['name' => '30% - 50%', 'Jumlah' => $dist['30% - 50%']],
                ['name' => '> 50%', 'Jumlah' => $dist['> 50%']],
            ];
            
            // Status Parameter Sistem
            $inactiveMonths = \App\Models\Setting::where('key', 'inactive_months')->value('value') ?? '11,12';
            $data['system_parameters'] = [
                'Bulan Non-Aktif' => $inactiveMonths,
                'Jasa Default' => '1.5% / bulan'
            ];
            
            // Alerts
            $data['alerts'] = [];
            if ($dist['> 50%'] > 0) {
                $data['alerts'][] = ['type' => 'warning', 'message' => $dist['> 50%'] . ' anggota mendekati/melebihi limit potongan gaji (50%+).'];
            }

        } elseif ($role === 'bendahara') {
            $stats['total_savings'] = $totalSavings;
            $stats['total_active_loans'] = $totalActiveLoans;
            $stats['pending_approval'] = \App\Models\Loan::whereIn('status', ['diajukan', 'diverifikasi', 'menunggu_bendahara'])->count(); 
            $stats['disbursement_this_month'] = \App\Models\Mutation::where('type', 'pencairan_pinjaman')
                ->whereMonth('created_at', now()->month)
                ->sum('amount');
            $stats['deduction_progress'] = 0; 

            // Approval Queue
            $data['approval_queue'] = \App\Models\Loan::with('user')->whereIn('status', ['diajukan', 'diverifikasi', 'menunggu_bendahara'])->take(5)->get();
            
            // Cash Flow
            $cashFlow = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $masuk = \App\Models\Mutation::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)
                    ->whereIn('type', ['simpanan', 'angsuran_pokok', 'angsuran_jasa'])->sum('amount');
                $keluar = \App\Models\Mutation::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)
                    ->where('type', 'pencairan_pinjaman')->sum('amount');
                $cashFlow->push(['name' => $date->translatedFormat('M'), 'Masuk' => $masuk, 'Keluar' => $keluar]);
            }
            $data['cash_flow'] = $cashFlow;
            
            // Komposisi Pinjaman
            $aktif = \App\Models\Loan::where('status', 'aktif')->count();
            $lunas = \App\Models\Loan::where('status', 'lunas')->count();
            $menunggu = \App\Models\Loan::whereIn('status', ['diajukan', 'diverifikasi', 'menunggu_bendahara', 'menunggu_ketua'])->count();
            $data['loan_composition'] = [
                ['name' => 'Aktif', 'value' => $aktif],
                ['name' => 'Lunas', 'value' => $lunas],
                ['name' => 'Menunggu', 'value' => $menunggu],
            ];

            $data['alerts'] = [];

        } elseif ($role === 'ketua') {
            $stats['total_assets'] = $totalSavings + $totalActiveLoans;
            $stats['total_active_loans'] = $totalActiveLoans;
            $stats['total_shu_expected'] = \App\Models\Mutation::whereYear('created_at', now()->year)->where('type', 'angsuran_jasa')->sum('amount');
            $stats['pending_executive_approval'] = \App\Models\Loan::whereIn('status', ['diajukan', 'diverifikasi', 'menunggu_ketua'])->count(); 

            // Tren Dana
            $assetTrend = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i)->endOfMonth();
                $totalSimpananHistory = \App\Models\Mutation::where('type', 'simpanan')->where('created_at', '<=', $date)->sum('amount');
                $totalPencairan = \App\Models\Mutation::where('type', 'pencairan_pinjaman')->where('created_at', '<=', $date)->sum('amount');
                $totalAngsuranPokok = \App\Models\Mutation::where('type', 'angsuran_pokok')->where('created_at', '<=', $date)->sum('amount');
                $outstandingLoans = $totalPencairan - $totalAngsuranPokok;
                $assetTrend->push(['name' => $date->translatedFormat('M'), 'Aset' => $totalSimpananHistory + $outstandingLoans]);
            }
            $data['asset_trend'] = $assetTrend;
            
            // Simpanan vs Pinjaman
            $savVsLoan = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $simp = \App\Models\Mutation::where('type', 'simpanan')->whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('amount');
                $pinj = \App\Models\Mutation::where('type', 'pencairan_pinjaman')->whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->sum('amount');
                $savVsLoan->push(['name' => $date->translatedFormat('M'), 'Simpanan' => $simp, 'Pinjaman' => $pinj]);
            }
            $data['savings_vs_loans'] = $savVsLoan;
            
            // Top Anggota
            $data['top_members'] = \App\Models\User::where('role', 'anggota')->orderBy('total_saving_balance', 'desc')->take(5)->get();
            
            // Approval Tingkat Eksekutif
            $data['executive_approvals'] = \App\Models\Loan::with('user')->whereIn('status', ['diajukan', 'diverifikasi', 'menunggu_ketua'])->take(5)->get();
            
            $data['health_score'] = 92; 
            
        } elseif ($role === 'pengawas') {
            $stats['total_transactions'] = \App\Models\Mutation::whereMonth('created_at', now()->month)->count();
            
            $currentPeriodId = \App\Models\DeductionPeriod::where('year', now()->year)->where('month', now()->month)->value('id');
            $stats['failed_deductions'] = $currentPeriodId ? \App\Models\DeductionDetail::where('deduction_period_id', $currentPeriodId)->where('status', 'gagal')->count() : 0;
            $stats['pending_recalculation'] = 0;

            // Log Mutasi
            $data['mutation_logs'] = \App\Models\Mutation::with('user')->orderBy('created_at', 'desc')->take(10)->get();
            
            // Status Rincian
            $data['failed_details'] = \App\Models\DeductionDetail::with('user')
                ->where('status', 'gagal')
                ->orderBy('created_at', 'desc')->take(5)->get();
            
            // Tren Transaksi
            $trxTrend = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $periodIds = \App\Models\DeductionPeriod::where('year', $date->year)->where('month', $date->month)->pluck('id');
                $berhasil = \App\Models\DeductionDetail::whereIn('deduction_period_id', $periodIds)->where('status', 'berhasil')->count();
                $gagal = \App\Models\DeductionDetail::whereIn('deduction_period_id', $periodIds)->where('status', 'gagal')->count();
                $trxTrend->push(['name' => $date->translatedFormat('M'), 'Berhasil' => $berhasil, 'Gagal' => $gagal]);
            }
            $data['transaction_trend'] = $trxTrend;
            
            // Riwayat Jasa Tahunan
            $data['annual_services'] = \App\Models\LoanAnnualService::with('loan.user')->take(5)->get() ?? [];
        }

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'roleData' => $data
        ]);
    }
}
