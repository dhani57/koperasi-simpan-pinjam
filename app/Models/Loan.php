<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'principal_amount',
        'cooperative_fee_percentage',
        'tenor_months',
        'monthly_installment',
        'status',
        'disbursed_at',
    ];

    protected $casts = [
        'disbursed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
