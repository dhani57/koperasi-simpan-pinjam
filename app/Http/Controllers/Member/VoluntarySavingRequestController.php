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
            'type' => 'required|in:ubah_nominal,tarik',
            'amount' => 'required|numeric|min:0',
        ]);

        $hasPending = VoluntarySavingRequest::where('user_id', auth()->id())
            ->where('status', 'menunggu')
            ->exists();
            
        if ($hasPending) {
            return back()->withErrors(['amount' => 'Anda masih memiliki pengajuan yang belum diproses.']);
        }

        $user = auth()->user();
        $type = $request->type;
        $amount = $request->amount;

        if ($type === 'tarik') {
            if ($amount <= 0 || $amount > $user->simpanan_sukarela_balance) {
                return back()->withErrors(['amount' => 'Jumlah penarikan tidak valid atau melebihi saldo.']);
            }
            VoluntarySavingRequest::create([
                'user_id' => $user->id,
                'type' => 'tarik',
                'amount' => $amount,
                'new_monthly_amount' => 0,
                'status' => 'menunggu',
                'balance_before' => $user->simpanan_sukarela_balance ?? 0,
                'balance_after' => ($user->simpanan_sukarela_balance ?? 0) - $amount,
            ]);
            $msg = 'Pengajuan penarikan simpanan sukarela berhasil dikirim.';
        } else {
            // ubah_nominal
            VoluntarySavingRequest::create([
                'user_id' => $user->id,
                'type' => 'ubah_nominal',
                'amount' => 0,
                'new_monthly_amount' => $amount,
                'status' => 'menunggu',
                'balance_before' => $user->simpanan_sukarela_balance ?? 0,
                'balance_after' => $user->simpanan_sukarela_balance ?? 0,
            ]);
            $msg = 'Pengajuan perubahan nominal simpanan sukarela berhasil dikirim.';
        }

        return redirect()->route('member.voluntary-saving-requests.index')->with('success', $msg);
    }
}
