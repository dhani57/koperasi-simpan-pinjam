<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShuDraft extends Model
{
    protected $fillable = ['year', 'user_id', 'nominal_shu'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
