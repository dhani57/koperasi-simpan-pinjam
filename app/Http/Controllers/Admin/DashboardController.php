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
            
            // Status Parameter Sistem
            $inactiveMonths = \App\Models\Setting::where('key', 'inactive_months')->value('value') ?? '11,12';
            $jasaDefault = \App\Models\Setting::where('key', 'loan_interest_rate')->value('value') ?? '1.5';
            
            $data['system_parameters'] = [
                'Bulan Non-Aktif' => str_replace(['[', ']', '"'], '', $inactiveMonths),
                'Jasa Default' => $jasaDefault . '% / bulan'
            ];
            
            // Alerts
            $data['alerts'] = [];

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
            $stats['total_simpanan_masuk'] = \App\Models\Mutation::whereMonth('created_at', now()->month)->where('type', 'simpanan')->sum('amount');
            $stats['total_angsuran_masuk'] = \App\Models\Mutation::whereMonth('created_at', now()->month)->whereIn('type', ['angsuran_pokok', 'angsuran_jasa'])->sum('amount');
            $stats['total_pencairan_keluar'] = \App\Models\Mutation::whereMonth('created_at', now()->month)->where('type', 'pencairan_pinjaman')->sum('amount');

            // Log Mutasi
            $data['mutation_logs'] = \App\Models\Mutation::with('user')->orderBy('created_at', 'desc')->take(10)->get();
            
            // Tren Transaksi Mutasi (Masuk vs Keluar)
            $trxTrend = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $masuk = \App\Models\Mutation::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)
                            ->whereIn('type', ['simpanan', 'angsuran_pokok', 'angsuran_jasa'])->sum('amount');
                $keluar = \App\Models\Mutation::whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)
                            ->where('type', 'pencairan_pinjaman')->sum('amount');
                $trxTrend->push(['name' => $date->translatedFormat('M'), 'Masuk' => $masuk, 'Keluar' => $keluar]);
            }
            $data['transaction_trend'] = $trxTrend;
        }

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'roleData' => $data
        ]);
    }
}
