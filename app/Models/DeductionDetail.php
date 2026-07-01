<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeductionDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'deduction_period_id',
        'user_id',
        'loan_id',
        'simpanan_wajib_amount',
        'simpanan_sukarela_amount',
        'admin_fee_amount',
        'loan_principal_amount',
        'loan_fee_amount',
        'status',
    ];

    public function deductionPeriod()
    {
        return $this->belongsTo(DeductionPeriod::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
