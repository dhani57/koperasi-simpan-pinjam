<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Cek apakah ada deduction period yang belum dikonfirmasi Bendahara (PRD Bagian 2.3)
        $pendingConfirmation = \App\Models\DeductionPeriod::where('status', '!=', 'dikonfirmasi')
            ->where('status', '!=', 'selesai')
            ->whereIn('status', ['proses', 'draf', 'disetujui_ketua'])
            ->exists();

        // Sisa plafon gaji
        $activeLoans = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['disetujui', 'aktif'])
            ->get();
            
        $totalLoanInstallments = $activeLoans->sum(function($loan) {
            return $loan->monthly_principal_installment + $loan->current_year_monthly_fee;
        });
        $availableLimit = $user->max_salary_deduction_limit - ($user->monthly_simpanan_wajib + $totalLoanInstallments);
        
        // Mutasi Terakhir
        $recentMutations = \App\Models\Mutation::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // SHU Terakhir
        $lastShu = \App\Models\Mutation::where('user_id', $user->id)
            ->where('type', 'like', '%shu%')
            ->orderBy('created_at', 'desc')
            ->first();

        return inertia('Member/Dashboard', [
            'totalSimpanan' => $user->total_saving_balance,
            'simpananPokok' => $user->simpanan_pokok_balance,
            'simpananWajib' => $user->simpanan_wajib_balance,
            'simpananSukarela' => $user->simpanan_sukarela_balance,
            'monthlySimpananWajib' => $user->monthly_simpanan_wajib,
            'monthlySimpananSukarela' => $user->monthly_simpanan_sukarela,
            'plafonTersedia' => max(0, $availableLimit),
            'activeLoans' => $activeLoans,
            'recentMutations' => $recentMutations,
            'lastShu' => $lastShu ? $lastShu->amount : 0,
            'hasFailedDebit' => (bool) $user->has_failed_debit,
            'pendingConfirmation' => $pendingConfirmation,
        ]);
    }
}
