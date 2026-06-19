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
        'tenor_years',
        'monthly_principal_installment',
        'current_remaining_principal',
        'current_year_monthly_fee',
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

    public function loanAnnualServices()
    {
        return $this->hasMany(LoanAnnualService::class);
    }
}
