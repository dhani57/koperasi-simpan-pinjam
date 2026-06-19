<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeductionPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'month',
        'year',
        'status',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function deductionDetails()
    {
        return $this->hasMany(DeductionDetail::class);
    }
}
