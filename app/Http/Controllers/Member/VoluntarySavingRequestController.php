<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VoluntarySavingRequest;

class VoluntarySavingRequestController extends Controller
{
    public function index()
    {
        $requests = VoluntarySavingRequest::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return inertia('Member/VoluntarySavingRequests/Index', [
            'requests' => $requests
        ]);
    }

    public function create()
    {
        return inertia('Member/VoluntarySavingRequests/Create', [
            'currentAmount' => auth()->user()->monthly_simpanan_sukarela
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'proposed_amount' => 'required|numeric|min:0',
        ]);

        $hasPending = VoluntarySavingRequest::where('user_id', auth()->id())
            ->where('status', 'menunggu')
            ->exists();
            
        if ($hasPending) {
            return back()->withErrors(['proposed_amount' => 'Anda masih memiliki pengajuan yang belum diproses.']);
        }

        VoluntarySavingRequest::create([
            'user_id' => auth()->id(),
            'type' => 'ubah_nominal',
            'amount' => 0,
            'new_monthly_amount' => $request->proposed_amount,
            'status' => 'menunggu',
            'balance_before' => auth()->user()->simpanan_sukarela_balance ?? 0,
            'balance_after' => auth()->user()->simpanan_sukarela_balance ?? 0,
        ]);

        return redirect()->route('member.voluntary-saving-requests.index')
            ->with('success', 'Pengajuan perubahan nominal simpanan sukarela berhasil dikirim.');
    }
}
