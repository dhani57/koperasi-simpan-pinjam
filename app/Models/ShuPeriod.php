<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShuPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'total_jasa_income',
        'persen_dana_sosial',
        'persen_thr_pengurus',
        'persen_shu_simpanan',
        'persen_shu_jasa',
        'persen_modal',
        'nominal_dana_sosial',
        'nominal_thr',
        'nominal_shu_simpanan',
        'nominal_shu_jasa',
        'nominal_modal',
        'status', // draft, approved, distributed
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
