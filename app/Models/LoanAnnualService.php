<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanAnnualService extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'year_number',
        'starting_remaining_principal',
        'monthly_fee',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
