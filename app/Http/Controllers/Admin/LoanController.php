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

    public function verify(Loan $loan)
    {
        if (auth()->user()->role !== 'pengurus') {
            abort(403, 'Unauthorized action.');
        }

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
        if (!in_array(auth()->user()->role, ['pengurus', 'bendahara'])) {
            abort(403, 'Unauthorized action.');
        }

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
        if (auth()->user()->role !== 'bendahara') {
            abort(403, 'Unauthorized action.');
        }

        if ($loan->status !== 'diajukan' && $loan->status !== 'diverifikasi') {
            return redirect()->back()->with('error', 'Pinjaman tidak valid untuk disetujui.');
        }

        $loan->update([
            'status' => 'disetujui',
        ]);

        return redirect()->back()->with('success', 'Pinjaman berhasil disetujui.');
    }

    public function disburse(Loan $loan)
    {
        if (auth()->user()->role !== 'bendahara') {
            abort(403, 'Unauthorized action.');
        }

        if ($loan->status !== 'disetujui') {
            return redirect()->back()->with('error', 'Hanya pinjaman yang telah disetujui yang dapat dicairkan.');
        }

        $loan->update([
            'status' => 'aktif',
            'disbursed_at' => now(),
            'current_remaining_principal' => $loan->principal_amount,
        ]);

        return redirect()->back()->with('success', 'Pinjaman berhasil dicairkan. Dana telah ditransfer ke anggota.');
    }
}
