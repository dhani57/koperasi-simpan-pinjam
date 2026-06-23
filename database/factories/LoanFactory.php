<?php

namespace Database\Factories;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanFactory extends Factory
{
    protected $model = Loan::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'principal_amount' => 10000000,
            'tenor_months' => 12,
            'status' => 'diajukan',
            'current_remaining_principal' => 10000000,
            'current_year_monthly_fee' => 150000,
            'cooperative_fee_percentage' => 1.5,
            'monthly_principal_installment' => 833333,
        ];
    }
}
