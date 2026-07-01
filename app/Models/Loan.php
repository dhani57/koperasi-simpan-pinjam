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
        'purpose',
        'cooperative_fee_percentage',
        'admin_fee_amount',
        'admin_fee_overridden',
        'tenor_months',
        'tenor_years',
        'monthly_principal_installment',
        'current_remaining_principal',
        'current_year_monthly_fee',
        'status',
        'disbursed_at',
        'admin_verified_at',
        'admin_verified_by',
        'transfer_proof_path',
        'bendahara_approved_at',
        'bendahara_approved_by',
        'ketua_approved_at',
        'ketua_approved_by',
        'document_path',
        'merged_from_loan_id',
        'merged_old_remaining',
    ];

    protected $casts = [
        'disbursed_at' => 'datetime',
        'admin_verified_at' => 'datetime',
        'bendahara_approved_at' => 'datetime',
        'ketua_approved_at' => 'datetime',
        'admin_fee_overridden' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function loanAnnualServices()
    {
        return $this->hasMany(LoanAnnualService::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'admin_verified_by');
    }

    public function mergedFromLoan()
    {
        return $this->belongsTo(Loan::class, 'merged_from_loan_id');
    }
}
