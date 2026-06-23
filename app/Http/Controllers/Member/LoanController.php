<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LoanService;

class LoanController extends Controller
{
    protected LoanService $loanService;

    public function __construct(LoanService $loanService)
    {
        $this->loanService = $loanService;
    }

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
        $totalLoanInstallments = 0;
        foreach ($activeLoans as $loan) {
            $totalLoanInstallments += ($loan->monthly_principal_installment + $loan->current_year_monthly_fee);
        }
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
            'tenor_years' => 'nullable|integer|min:1|max:5',
            'tenor_months' => 'nullable|integer|min:1|max:60',
            'purpose' => 'nullable|string|max:1000',
        ]);

        if (!$request->tenor_years && !$request->tenor_months) {
            return back()->withErrors(['tenor_years' => 'Tenor wajib diisi (tahun atau bulan).']);
        }

        $principal = $request->principal_amount;
        $tenorYears = $request->tenor_years;
        $tenorMonths = $request->tenor_months;
        $purpose = $request->purpose;
        $feePercentage = \App\Models\Setting::where('key', 'default_cooperative_fee_percentage')->value('value') ?? 1.5;
        
        // Cek lagi apakah ada pinjaman aktif
        $hasActiveLoan = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['diajukan', 'disetujui', 'aktif'])
            ->exists();
            
        if ($hasActiveLoan) {
            return back()->withErrors(['principal_amount' => 'Anda masih memiliki pinjaman aktif atau dalam proses pengajuan.']);
        }

        // Simulasi untuk mendapatkan cicilan tahun pertama
        $simulation = $this->loanService->calculateSimulation($principal, $tenorYears, $tenorMonths, (float)$feePercentage);
        $firstYearMonthly = $simulation['yearly_breakdown'][0]['monthly_total'];

        // Validasi Limit
        if (!$this->loanService->validateLimit($user, $firstYearMonthly)) {
            return back()->withErrors(['principal_amount' => 'Cicilan bulan pertama (Rp ' . number_format($firstYearMonthly, 0, ',', '.') . ') melebihi sisa plafon gaji Anda.']);
        }
        
        $this->loanService->createLoan($user, $principal, $tenorYears, $tenorMonths, $purpose);

        return redirect()->route('member.loans.index')->with('success', 'Pengajuan pinjaman berhasil dibuat dan menunggu verifikasi.');
    }
}
