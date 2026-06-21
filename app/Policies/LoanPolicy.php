<?php

namespace App\Policies;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LoanPolicy
{
    use HandlesAuthorization;

    /**
     * Tentukan apakah user bisa melihat daftar pinjaman.
     */
    public function viewAny(User $user)
    {
        return in_array($user->role, ['admin', 'pengurus', 'bendahara', 'ketua', 'pengawas']);
    }

    /**
     * Tentukan apakah user bisa verifikasi administratif.
     */
    public function verify(User $user, Loan $loan)
    {
        return in_array($user->role, ['pengurus', 'bendahara', 'ketua']);
    }

    /**
     * Tentukan apakah user bisa menyetujui pinjaman.
     */
    public function approve(User $user, Loan $loan)
    {
        return in_array($user->role, ['bendahara', 'ketua']);
    }

    /**
     * Tentukan apakah user bisa menolak pinjaman.
     */
    public function reject(User $user, Loan $loan)
    {
        return in_array($user->role, ['pengurus', 'bendahara', 'ketua']);
    }

    /**
     * Tentukan apakah user bisa mencairkan pinjaman (upload bukti transfer).
     */
    public function disburse(User $user, Loan $loan)
    {
        return $user->role === 'bendahara';
    }

    /**
     * Tentukan apakah user bisa memverifikasi bukti transfer pencairan.
     */
    public function verifyDisbursement(User $user, Loan $loan)
    {
        return $user->role === 'ketua';
    }
}
