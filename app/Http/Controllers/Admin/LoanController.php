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
        if ($loan->status !== 'diajukan') {
            return redirect()->back()->with('error', 'Hanya pinjaman dengan status diajukan yang dapat ditolak.');
        }

        $loan->update([
            'status' => 'ditolak',
            'admin_verified_at' => now(),
            'admin_verified_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Pinjaman berhasil ditolak.');
    }
}
