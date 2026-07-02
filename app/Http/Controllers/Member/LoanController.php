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
            'hasFailedDebit' => (bool) $user->has_failed_debit,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // PRD Bagian 5.2: Blokir pengajuan jika anggota gagal debit
        if ($user->has_failed_debit) {
            return back()->withErrors(['principal_amount' => 'Anda tidak dapat mengajukan pinjaman karena memiliki status gagal debit aktif. Silakan hubungi Admin.']);
        }
        
        $request->validate([
            'principal_amount' => 'required|numeric|min:100000',
            'tenor_years' => 'nullable|integer|in:1,2,3',
            'tenor_months' => 'nullable|integer|min:1',
            'purpose' => 'nullable|string|max:1000',
            'document_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if (!$request->tenor_years && !$request->tenor_months) {
            return back()->withErrors(['tenor_years' => 'Pilih lama pinjaman (tahun atau bulan).']);
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
        $tenorYears = $request->tenor_years ?: null;
        $tenorMonths = $request->tenor_months ?: null;
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

        if ($principal > 50000000 && !$request->hasFile('document_file')) {
            return back()->withErrors(['document_file' => 'Pinjaman di atas Rp 50 Juta wajib melampirkan dokumen persetujuan.']);
        }

        // Limit is now based dynamically on salary deduction capacity, the hard 50jt cap is replaced by document validation.
        if (!$this->loanService->validateMaxPrincipal($principal)) {
            return back()->withErrors(['principal_amount' => 'Pinjaman ditolak oleh aturan limit layanan.']);
        }

        // Simulasi untuk mendapatkan cicilan tahun pertama
        $simulation = $this->loanService->calculateSimulation($principal, $tenorYears, $tenorMonths, (float)$feePercentage);
        $firstYearMonthly = $simulation['yearly_breakdown'][0]['monthly_total'];

        // Validasi Limit
        if (!$this->loanService->validateLimit($user, $firstYearMonthly)) {
            return back()->withErrors(['principal_amount' => 'Cicilan bulan pertama (Rp ' . number_format($firstYearMonthly, 0, ',', '.') . ') melebihi sisa plafon gaji Anda.']);
        }
        
        $loan = $this->loanService->createLoan($user, $principal, $tenorYears, $tenorMonths, $purpose, null, $mergedFromLoanId, $mergedOldRemaining);

        if ($request->hasFile('document_file')) {
            $path = $request->file('document_file')->store('loan_documents', 'public');
            $loan->update(['document_path' => $path]);
        }

        return redirect()->route('member.loans.index')->with('success', 'Pengajuan pinjaman berhasil dibuat dan menunggu verifikasi.');
    }
}
