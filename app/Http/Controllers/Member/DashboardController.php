<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Sisa plafon gaji: (max_salary_deduction_limit) - (monthly_simpanan_wajib + sum of active loan monthly_installments)
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
            'simpananWajib' => $user->monthly_simpanan_wajib,
            'simpananSukarela' => $user->monthly_simpanan_sukarela,
            'plafonTersedia' => max(0, $availableLimit),
            'activeLoans' => $activeLoans,
            'recentMutations' => $recentMutations,
            'lastShu' => $lastShu ? $lastShu->amount : 0,
        ]);
    }
}
