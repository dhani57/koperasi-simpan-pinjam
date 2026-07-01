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
        
        // Cek apakah ada pinjaman yang masih diajukan (pending)
        $hasPendingLoan = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['diajukan', 'disetujui', 'menunggu_bendahara', 'menunggu_ketua', 'menunggu_pencairan'])
            ->exists();
            
        $activeLoan = \App\Models\Loan::where('user_id', $user->id)->where('status', 'aktif')->first();
        // Ambil default fee (contoh: 1.5)
        $defaultFee = \App\Models\Setting::where('key', 'loan_interest_rate')->value('value') ?? 1.5;

        // Plafon tersedia
        $activeLoans = \App\Models\Loan::where('user_id', $user->id)->whereIn('status', ['disetujui', 'aktif'])->get();
        $totalLoanInstallments = 0;
        foreach ($activeLoans as $loan) {
            $totalLoanInstallments += ($loan->monthly_principal_installment + $loan->current_year_monthly_fee);
        }
        $availableLimit = $user->max_salary_deduction_limit - ($user->monthly_simpanan_wajib + $totalLoanInstallments);

        return inertia('Member/Loans/Create', [
            'hasPendingLoan' => $hasPendingLoan,
            'activeLoan' => $activeLoan,
            'defaultFee' => (float) $defaultFee,
            'availableLimit' => max(0, $availableLimit),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'principal_amount' => 'required|numeric|min:100000',
            'tenor_type' => 'required|in:standar,custom',
            'tenor_months' => 'required|integer|min:1',
            'purpose' => 'nullable|string|max:1000',
        ], [
            'tenor_type.required' => 'Tenor wajib diisi (tahun atau bulan).',
        ]);

        if ($request->tenor_type === 'standar' && !in_array($request->tenor_months, [10, 20, 30])) {
            return back()->withErrors(['tenor_months' => 'Pilihan tenor standar tidak valid.']);
        }

        $now = now();
        $retirementYear = $user->retirement_year;
        $retirementMonth = $user->retirement_month;
        if ($retirementYear && $retirementMonth) {
            $monthsRemaining = (($retirementYear - $now->year) * 12) + ($retirementMonth - $now->month);
            if ($request->tenor_months > $monthsRemaining) {
                return back()->withErrors(['tenor_months' => 'Tenor melebihi sisa masa bakti Anda.']);
            }
        }

        $principal = $request->principal_amount;
        $tenorYears = null;
        $tenorMonths = $request->tenor_months;
        $purpose = $request->purpose;
        $feePercentage = \App\Models\Setting::where('key', 'loan_interest_rate')->value('value') ?? 1.5;
        
        // Cek pinjaman aktif untuk logika Top Up
        $activeLoan = \App\Models\Loan::where('user_id', $user->id)
            ->where('status', 'aktif')
            ->first();
            
        $pendingLoan = \App\Models\Loan::where('user_id', $user->id)
            ->whereIn('status', ['diajukan', 'disetujui', 'menunggu_bendahara', 'menunggu_ketua', 'menunggu_pencairan'])
            ->exists();
            
        if ($pendingLoan) {
            return back()->withErrors(['principal_amount' => 'Anda masih memiliki pinjaman dalam proses pengajuan.']);
        }

        $mergedFromLoanId = null;
        $mergedOldRemaining = 0;
        
        if ($activeLoan) {
            $mergedFromLoanId = $activeLoan->id;
            $mergedOldRemaining = $activeLoan->current_remaining_principal;
            $principal += $mergedOldRemaining; // Total pokok pinjaman baru = tambahan + sisa lama
        }

        if (!$this->loanService->validateMaxPrincipal($principal)) {
            return back()->withErrors(['principal_amount' => 'Total pinjaman (termasuk sisa lama) melebihi batas maksimal Rp 50.000.000.']);
        }

        // Simulasi untuk mendapatkan cicilan tahun pertama
        $simulation = $this->loanService->calculateSimulation($principal, $tenorYears, $tenorMonths, (float)$feePercentage);
        $firstYearMonthly = $simulation['yearly_breakdown'][0]['monthly_total'];

        // Validasi Limit
        if (!$this->loanService->validateLimit($user, $firstYearMonthly)) {
            return back()->withErrors(['principal_amount' => 'Cicilan bulan pertama (Rp ' . number_format($firstYearMonthly, 0, ',', '.') . ') melebihi sisa plafon gaji Anda.']);
        }
        
        $this->loanService->createLoan($user, $principal, $tenorYears, $tenorMonths, $purpose, null, $mergedFromLoanId, $mergedOldRemaining);

        return redirect()->route('member.loans.index')->with('success', 'Pengajuan pinjaman berhasil dibuat dan menunggu verifikasi.');
    }
}
