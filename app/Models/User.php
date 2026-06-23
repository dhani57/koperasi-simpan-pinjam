<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name', 'email', 'password', 'phone', 'identity_number', 'role', 'is_anggota',
    'monthly_saving_nominal', 'max_salary_deduction_limit', 'total_saving_balance',
    'profile_photo_path', 'department', 'joined_at', 'job_title', 
    'job_start_date', 'job_end_date', 'last_login_at'
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $appends = ['roles_array'];

    public function getRolesArrayAttribute()
    {
        $roles = [];
        if ($this->is_anggota || $this->role === 'anggota') {
            $roles[] = 'anggota';
        }
        if ($this->role !== 'anggota') {
            $roles[] = $this->role;
        }
        return $roles;
    }

    public function hasRole($role)
    {
        return in_array($role, $this->roles_array);
    }

    public function activityLogs()
    {
        return $this->hasMany(UserActivityLog::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
