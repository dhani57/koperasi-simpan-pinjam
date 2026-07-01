<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VoluntarySavingRequest;

class VoluntarySavingRequestController extends Controller
{
    public function index()
    {
        if (!in_array(auth()->user()->role, ['bendahara', 'pengurus'])) {
            abort(403, 'Unauthorized action.');
        }

        $requests = VoluntarySavingRequest::with('user')
            ->orderByRaw("CASE WHEN status = 'menunggu' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return inertia('Admin/VoluntarySavingRequests/Index', [
            'requests' => $requests
        ]);
    }

    public function approve(Request $request, VoluntarySavingRequest $voluntarySavingRequest)
    {
        if ($voluntarySavingRequest->status !== 'menunggu') {
            return back()->with('error', 'Status pengajuan tidak valid.');
        }

        $voluntarySavingRequest->update([
            'status' => 'disetujui',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $voluntarySavingRequest->user->update([
            'monthly_simpanan_sukarela' => $voluntarySavingRequest->new_monthly_amount
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'voluntary_saving_approved',
            "Menyetujui perubahan simpanan sukarela untuk anggota {$voluntarySavingRequest->user->name}"
        );

        return back()->with('success', 'Pengajuan disetujui, nominal simpanan sukarela diperbarui.');
    }

    public function reject(Request $request, VoluntarySavingRequest $voluntarySavingRequest)
    {
        if ($voluntarySavingRequest->status !== 'menunggu') {
            return back()->with('error', 'Status pengajuan tidak valid.');
        }

        $voluntarySavingRequest->update([
            'status' => 'ditolak',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'voluntary_saving_rejected',
            "Menolak perubahan simpanan sukarela untuk anggota {$voluntarySavingRequest->user->name}"
        );

        return back()->with('success', 'Pengajuan ditolak.');
    }
}
