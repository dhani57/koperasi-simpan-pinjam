<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoluntarySavingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type', // setor, tarik, ubah_nominal
        'amount',
        'new_monthly_amount',
        'status', // menunggu, disetujui, ditolak
        'balance_before',
        'balance_after',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
