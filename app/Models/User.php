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
    'max_salary_deduction_limit', 
    'simpanan_pokok_balance', 'simpanan_wajib_balance', 'simpanan_sukarela_balance',
    'monthly_simpanan_wajib', 'monthly_simpanan_sukarela',
    'bank_account_number', 'retirement_month', 'retirement_year', 'has_failed_debit',
    'profile_photo_path', 'department', 'joined_at', 'job_title', 
    'job_start_date', 'job_end_date', 'last_login_at'
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $appends = ['roles_array', 'total_saving_balance'];

    public function getTotalSavingBalanceAttribute()
    {
        return $this->simpanan_pokok_balance + $this->simpanan_wajib_balance + $this->simpanan_sukarela_balance;
    }

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

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function voluntarySavingRequests()
    {
        return $this->hasMany(VoluntarySavingRequest::class);
    }

    public function isRetiredByDate($month, $year)
    {
        if (!$this->retirement_month || !$this->retirement_year) {
            return false;
        }

        if ($year > $this->retirement_year) {
            return true;
        }

        if ($year == $this->retirement_year && $month >= $this->retirement_month) {
            return true;
        }

        return false;
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
            'has_failed_debit' => 'boolean',
            'is_anggota' => 'boolean',
            'retirement_month' => 'integer',
            'retirement_year' => 'integer',
        ];
    }
}
