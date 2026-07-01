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
        'confirmed_by',
        'confirmed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'confirmed_at' => 'datetime',
    ];

    public function deductionDetails()
    {
        return $this->hasMany(DeductionDetail::class);
    }
}
