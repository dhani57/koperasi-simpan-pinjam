<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;
use Illuminate\Support\Facades\Gate;

class LoanController extends Controller
{
    public function index()
    {
        if (auth()->user()->role === 'pengurus') {
            abort(403, 'Unauthorized action.');
        }

        $search = request('search');
        $status = request('status');

        $loans = Loan::with(['user', 'verifiedBy'])
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->whereRaw('lower(name) like lower(?)', ["%{$search}%"]);
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->appends(request()->query());
            
        return inertia('Admin/Loans/Index', [
            'loans' => $loans,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    public function show(Loan $loan)
    {
        if (auth()->user()->role === 'pengurus') {
            abort(403, 'Unauthorized action.');
        }

        $loan->load('user');
        
        // Cek limit potongan
        $activeLoans = Loan::where('user_id', $loan->user_id)->whereIn('status', ['disetujui', 'aktif'])->get();
        $totalLoanInstallments = 0;
        foreach ($activeLoans as $activeLoan) {
            $totalLoanInstallments += ($activeLoan->monthly_principal_installment + $activeLoan->current_year_monthly_fee);
        }
        
        $userLimit = $loan->user->max_salary_deduction_limit;
        $monthlySaving = $loan->user->monthly_simpanan_wajib;
        
        $currentMonthlyInstallment = $loan->monthly_principal_installment + $loan->current_year_monthly_fee;
        
        // Jika status diajukan/diverifikasi/menunggu_x, hitung juga cicilannya karena belum masuk status disetujui/aktif
        $isPending = in_array($loan->status, ['diajukan', 'diverifikasi', 'menunggu_bendahara', 'menunggu_ketua']);
        if ($isPending) {
            $totalLoanInstallments += $currentMonthlyInstallment;
        }

        $usedLimit = $monthlySaving + $totalLoanInstallments;
        $usedPercentage = $userLimit > 0 ? round(($usedLimit / $userLimit) * 100, 1) : 0;

        return inertia('Admin/Loans/Show', [
            'loan' => $loan,
            'limitInfo' => [
                'maxLimit' => $userLimit,
                'monthlySaving' => $monthlySaving,
                'totalInstallments' => $totalLoanInstallments,
                'usedLimit' => $usedLimit,
                'usedPercentage' => $usedPercentage,
                'currentLoanInstallment' => $currentMonthlyInstallment,
                'adminFee' => $loan->admin_fee_amount,
            ]
        ]);
    }

    public function verify(Request $request, Loan $loan)
    {
        Gate::authorize('verify', $loan);

        if ($loan->status !== 'diajukan') {
            return redirect()->back()->with('error', 'Hanya pinjaman dengan status diajukan yang dapat diverifikasi.');
        }

        $loan->update([
            'admin_verified_at' => now(),
            'admin_verified_by' => auth()->id(),
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'loan_verified',
            "Memverifikasi administrasi pinjaman #{$loan->id}"
        );

        return redirect()->back()->with('success', 'Pinjaman berhasil diverifikasi secara administrasi.');
    }

    public function reject(Loan $loan, Request $request)
    {
        Gate::authorize('reject', $loan);

        if ($loan->status !== 'diajukan' && $loan->status !== 'menunggu_ketua' && $loan->status !== 'menunggu_bendahara') {
            // Jika sudah aktif/disetujui/lunas, tidak bisa ditolak
        }

        $loan->update([
            'status' => 'ditolak',
            'admin_verified_at' => auth()->user()->role === 'pengurus' ? now() : $loan->admin_verified_at,
            'admin_verified_by' => auth()->user()->role === 'pengurus' ? auth()->id() : $loan->admin_verified_by,
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'loan_rejected',
            "Menolak pengajuan pinjaman #{$loan->id}"
        );

        return redirect()->back()->with('success', 'Pinjaman berhasil ditolak.');
    }

    public function approve(Request $request, Loan $loan)
    {
        Gate::authorize('approve', $loan);

        $validStatuses = ['diajukan', 'menunggu_bendahara', 'menunggu_ketua'];
        if (!in_array($loan->status, $validStatuses)) {
            return redirect()->back()->with('error', 'Pinjaman tidak valid untuk disetujui.');
        }

        // Validate override inputs (Ketua & Bendahara can override admin fee & service fee)
        $validated = $request->validate([
            'admin_fee_override' => 'nullable|numeric|min:0',
            'fee_percentage_override' => 'nullable|numeric|min:0|max:100',
        ]);

        $user = auth()->user();

        // Apply admin fee override if provided
        if (isset($validated['admin_fee_override'])) {
            $loan->admin_fee_amount = $validated['admin_fee_override'];
            $loan->admin_fee_overridden = true;
        }

        // Apply service fee percentage override if provided
        if (isset($validated['fee_percentage_override'])) {
            $oldPercentage = $loan->cooperative_fee_percentage;
            $newPercentage = $validated['fee_percentage_override'];
            $loan->cooperative_fee_percentage = $newPercentage;

            // Recalculate current_year_monthly_fee based on new percentage
            $loan->current_year_monthly_fee = $loan->current_remaining_principal * ($newPercentage / 100);
        }

        if ($user->role === 'bendahara') {
            $loan->bendahara_approved_at = now();
            $loan->bendahara_approved_by = $user->id;
        } elseif ($user->role === 'ketua') {
            $loan->ketua_approved_at = now();
            $loan->ketua_approved_by = $user->id;
        }

        if ($loan->bendahara_approved_at && $loan->ketua_approved_at) {
            $loan->status = 'disetujui';
        } elseif ($loan->bendahara_approved_at) {
            $loan->status = 'menunggu_ketua';
        } elseif ($loan->ketua_approved_at) {
            $loan->status = 'menunggu_bendahara';
        }

        $loan->save();

        $overrideNote = '';
        if (isset($validated['admin_fee_override'])) {
            $overrideNote .= " Biaya admin di-override menjadi Rp " . number_format($validated['admin_fee_override'], 0, ',', '.') . ".";
        }
        if (isset($validated['fee_percentage_override'])) {
            $overrideNote .= " Jasa di-override menjadi {$validated['fee_percentage_override']}%.";
        }

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'loan_approved',
            "Menyetujui pinjaman #{$loan->id} (Status baru: {$loan->status}).{$overrideNote}"
        );

        return redirect()->back()->with('success', 'Persetujuan pinjaman berhasil dicatat.');
    }

    public function disburse(Request $request, Loan $loan)
    {
        Gate::authorize('disburse', $loan);

        if ($loan->status !== 'disetujui') {
            return redirect()->back()->with('error', 'Hanya pinjaman dengan status disetujui yang dapat diproses pencairannya.');
        }

        $loan->update([
            'status' => 'aktif',
            'disbursed_at' => now(),
            'current_remaining_principal' => $loan->principal_amount,
        ]);

        // Merekam mutasi pencairan
        \App\Models\Mutation::create([
            'user_id' => $loan->user_id,
            'type' => 'pencairan_pinjaman',
            'amount' => $loan->principal_amount,
            'balance_after' => 0, // In a real scenario, this is derived from member's balance logic if applicable
            'description' => 'Pencairan pinjaman #' . $loan->id,
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'loan_disbursed',
            "Mencairkan pinjaman #{$loan->id} sejumlah " . number_format($loan->principal_amount, 0, ',', '.')
        );

        return redirect()->back()->with('success', 'Dana berhasil dikirim dan pinjaman kini telah aktif.');
    }

    public function verifyDisbursement(Request $request, Loan $loan)
    {
        Gate::authorize('verifyDisbursement', $loan);

        if ($loan->status !== 'menunggu_pencairan') {
            return redirect()->back()->with('error', 'Hanya pinjaman dengan status menunggu pencairan yang dapat diverifikasi.');
        }

        $loan->update([
            'status' => 'aktif',
            'disbursed_at' => now(),
            'current_remaining_principal' => $loan->principal_amount,
        ]);

        // Merekam mutasi pencairan
        \App\Models\Mutation::create([
            'user_id' => $loan->user_id,
            'type' => 'pencairan_pinjaman',
            'amount' => $loan->principal_amount,
            'balance_after' => 0, // In a real scenario, this is derived from member's balance logic if applicable
            'description' => 'Pencairan pinjaman #' . $loan->id,
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'loan_disbursement_verified',
            "Memverifikasi pencairan pinjaman #{$loan->id}"
        );

        return redirect()->back()->with('success', 'Pencairan pinjaman berhasil diverifikasi. Pinjaman kini aktif.');
    }
}
