<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Sisa plafon gaji: (max_salary_deduction_limit) - (monthly_saving_nominal + sum of active loan monthly_installments)
        $activeLoans = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['disetujui', 'aktif'])
            ->get();
            
        $totalLoanInstallments = $activeLoans->sum('monthly_installment');
        $availableLimit = $user->max_salary_deduction_limit - ($user->monthly_saving_nominal + $totalLoanInstallments);
        
        // Mutasi Terakhir
        $recentMutations = \App\Models\Mutation::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return inertia('Member/Dashboard', [
            'totalSimpanan' => $user->total_saving_balance,
            'simpananRutin' => $user->monthly_saving_nominal,
            'plafonTersedia' => max(0, $availableLimit),
            'activeLoans' => $activeLoans,
            'recentMutations' => $recentMutations,
        ]);
    }
}
