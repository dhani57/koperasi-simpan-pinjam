<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index()
    {
        $loans = \App\Models\Loan::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return inertia('Member/Loans/Index', [
            'loans' => $loans
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        
        // Cek apakah ada pinjaman yang masih diajukan atau aktif
        $hasActiveLoan = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['diajukan', 'disetujui', 'aktif'])
            ->exists();
            
        // Ambil default fee (contoh: 1.5)
        $defaultFee = \App\Models\Setting::where('key', 'default_cooperative_fee_percentage')->value('value') ?? 1.5;

        // Plafon tersedia
        $activeLoans = \App\Models\Loan::where('user_id', $user->id)->whereIn('status', ['disetujui', 'aktif'])->get();
        $totalLoanInstallments = $activeLoans->sum('monthly_installment');
        $availableLimit = $user->max_salary_deduction_limit - ($user->monthly_saving_nominal + $totalLoanInstallments);

        return inertia('Member/Loans/Create', [
            'hasActiveLoan' => $hasActiveLoan,
            'defaultFee' => (float) $defaultFee,
            'availableLimit' => max(0, $availableLimit),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'principal_amount' => 'required|numeric|min:100000',
            'tenor_months' => 'required|integer|min:1|max:60',
        ]);

        $principal = $request->principal_amount;
        $tenor = $request->tenor_months;
        $feePercentage = \App\Models\Setting::where('key', 'default_cooperative_fee_percentage')->value('value') ?? 1.5;
        
        // Hitung cicilan
        $totalFee = $principal * ($feePercentage / 100) * $tenor;
        $totalRepayment = $principal + $totalFee;
        $monthlyInstallment = ceil($totalRepayment / $tenor);
        
        // Validasi Limit
        $activeLoans = \App\Models\Loan::where('user_id', $user->id)->whereIn('status', ['disetujui', 'aktif'])->get();
        $totalLoanInstallments = $activeLoans->sum('monthly_installment');
        $availableLimit = $user->max_salary_deduction_limit - ($user->monthly_saving_nominal + $totalLoanInstallments);

        if ($monthlyInstallment > $availableLimit) {
            return back()->withErrors(['principal_amount' => 'Cicilan per bulan (Rp ' . number_format($monthlyInstallment, 0, ',', '.') . ') melebihi sisa plafon gaji Anda (Rp ' . number_format($availableLimit, 0, ',', '.') . ').']);
        }
        
        // Cek lagi apakah ada pinjaman aktif
        $hasActiveLoan = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['diajukan', 'disetujui', 'aktif'])
            ->exists();
            
        if ($hasActiveLoan) {
            return back()->withErrors(['principal_amount' => 'Anda masih memiliki pinjaman aktif atau dalam proses pengajuan.']);
        }

        \App\Models\Loan::create([
            'user_id' => $user->id,
            'principal_amount' => $principal,
            'cooperative_fee_percentage' => $feePercentage,
            'tenor_months' => $tenor,
            'monthly_installment' => $monthlyInstallment,
            'status' => 'diajukan'
        ]);

        return redirect()->route('member.loans.index')->with('success', 'Pengajuan pinjaman berhasil dibuat dan menunggu verifikasi.');
    }
}
