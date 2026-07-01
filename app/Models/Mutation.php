<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mutation extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'saving_type',
        'amount',
        'balance_after',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
