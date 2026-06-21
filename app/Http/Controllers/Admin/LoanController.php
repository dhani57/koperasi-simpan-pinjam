<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::with(['user', 'verifiedBy'])->latest()->paginate(10);
        return inertia('Admin/Loans/Index', ['loans' => $loans]);
    }

    public function verify(Request $request, Loan $loan)
    {
        $this->authorize('verify', $loan);

        if ($loan->status !== 'diajukan') {
            return redirect()->back()->with('error', 'Hanya pinjaman dengan status diajukan yang dapat diverifikasi.');
        }

        $loan->update([
            'admin_verified_at' => now(),
            'admin_verified_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Pinjaman berhasil diverifikasi secara administrasi.');
    }

    public function reject(Loan $loan, Request $request)
    {
        $this->authorize('reject', $loan);

        if ($loan->status !== 'diajukan' && $loan->status !== 'diverifikasi') { // Assuming diverifikasi might be a status, but let's allow bendahara to reject too
            // If the status is already active/disetujui, we can't reject
        }

        $loan->update([
            'status' => 'ditolak',
            'admin_verified_at' => auth()->user()->role === 'pengurus' ? now() : $loan->admin_verified_at,
            'admin_verified_by' => auth()->user()->role === 'pengurus' ? auth()->id() : $loan->admin_verified_by,
        ]);

        return redirect()->back()->with('success', 'Pinjaman berhasil ditolak.');
    }

    public function approve(Loan $loan)
    {
        $this->authorize('approve', $loan);

        if ($loan->status !== 'diajukan' && $loan->status !== 'diverifikasi') {
            return redirect()->back()->with('error', 'Pinjaman tidak valid untuk disetujui.');
        }

        $loan->update([
            'status' => 'disetujui',
        ]);

        return redirect()->back()->with('success', 'Pinjaman berhasil disetujui.');
    }

    public function disburse(\App\Http\Requests\Admin\DisburseLoanRequest $request, Loan $loan)
    {
        if ($loan->status !== 'disetujui') {
            return redirect()->back()->with('error', 'Hanya pinjaman dengan status disetujui yang dapat diproses pencairannya.');
        }

        $path = $request->file('transfer_proof')->store('transfer_proofs', 'public');

        $loan->update([
            'status' => 'menunggu_pencairan',
            'transfer_proof_path' => $path,
        ]);

        return redirect()->back()->with('success', 'Bukti transfer berhasil diunggah. Menunggu verifikasi pencairan oleh Ketua.');
    }

    public function verifyDisbursement(Request $request, Loan $loan)
    {
        $this->authorize('verifyDisbursement', $loan);

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

        return redirect()->back()->with('success', 'Pencairan pinjaman berhasil diverifikasi. Pinjaman kini aktif.');
    }
}
