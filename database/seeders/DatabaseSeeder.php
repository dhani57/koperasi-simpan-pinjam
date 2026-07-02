<?php

namespace Database\Seeders;

use App\Models\DeductionDetail;
use App\Models\DeductionPeriod;
use App\Models\Loan;
use App\Models\Mutation;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Settings
        $this->call([
            SettingSeeder::class,
        ]);

        $startDate = Carbon::create(2025, 1, 1);
        $currentDate = Carbon::create(2026, 6, 15);

        // 2. Default Roles
        $adminUsers = [
            [
                'name' => 'Admin Pengurus',
                'email' => 'admin@koperasi.internal',
                'identity_number' => 'ADM-001',
                'password' => bcrypt('password'),
                'role' => 'pengurus',
                'is_anggota' => false,
                'monthly_simpanan_wajib' => 50000,
                'max_salary_deduction_limit' => 0,
                'simpanan_wajib_balance' => 0,
            ],
            [
                'name' => 'Bapak Ketua',
                'email' => 'ketua@koperasi.internal',
                'identity_number' => 'ADM-002',
                'password' => bcrypt('password'),
                'role' => 'ketua',
                'is_anggota' => false,
                'monthly_simpanan_wajib' => 50000,
                'max_salary_deduction_limit' => 0,
                'simpanan_wajib_balance' => 0,
            ],
            [
                'name' => 'Ibu Bendahara',
                'email' => 'bendahara@koperasi.internal',
                'identity_number' => 'ADM-003',
                'password' => bcrypt('password'),
                'role' => 'bendahara',
                'is_anggota' => false,
                'monthly_simpanan_wajib' => 50000,
                'max_salary_deduction_limit' => 0,
                'simpanan_wajib_balance' => 0,
            ],
            [
                'name' => 'Bapak Pengawas',
                'email' => 'pengawas@koperasi.internal',
                'identity_number' => 'ADM-004',
                'password' => bcrypt('password'),
                'role' => 'pengawas',
                'is_anggota' => false,
                'monthly_simpanan_wajib' => 50000,
                'max_salary_deduction_limit' => 0,
                'simpanan_wajib_balance' => 0,
            ]
        ];

        foreach ($adminUsers as $admin) {
            User::firstOrCreate(['email' => $admin['email']], $admin);
        }

        // 3. 200 Regular Members (Anggota)
        $members = [];
        // Demo member
        $members[] = User::firstOrCreate(['email' => 'anggota@koperasi.internal'], [
            'name' => 'Anggota Biasa',
            'identity_number' => 'ANG-001',
            'password' => bcrypt('password'),
            'role' => 'anggota',
            'is_anggota' => true,
            'joined_at' => $startDate,
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 2000000,
            'simpanan_wajib_balance' => 0,
            'department' => 'FT',
        ]);

        // Generate 199 more members
        for ($i = 2; $i <= 200; $i++) {
            $members[] = User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'identity_number' => 'ANG-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'password' => bcrypt('password'),
                'role' => 'anggota',
                'is_anggota' => true,
                'joined_at' => $startDate,
                'monthly_simpanan_wajib' => fake()->randomElement([50000, 100000, 150000, 200000]),
                'max_salary_deduction_limit' => fake()->randomElement([1500000, 2000000, 2500000, 3000000]),
                'simpanan_wajib_balance' => 0,
                'department' => fake()->randomElement(['FEB', 'FH', 'FKIP', 'FT', 'FK', 'FP', 'FMIPA', 'FISIP']),
            ]);
        }

        // Generate deduction periods from Jan 2025 to May 2026
        $periods = [];
        $periodDate = $startDate->copy();
        while ($periodDate->format('Y-m') <= '2026-05') {
            $period = DeductionPeriod::create([
                'month' => $periodDate->month,
                'year' => $periodDate->year,
                'status' => 'selesai',
                'is_active' => true,
            ]);
            $periods[$periodDate->format('Y-m')] = $period;
            $periodDate->addMonth();
        }

        $pengurusId = User::where('role', 'pengurus')->first()->id;

        // 4. Activity Simulation (Loans & Mutations)
        foreach ($members as $member) {
            $balance = 0;
            $periodDate = $startDate->copy();
            
            // Randomly decide if this member takes a loan in early 2025
            $hasLoan = rand(1, 100) <= 70; // 70% chance
            $loan = null;
            if ($hasLoan) {
                $loanMonth = rand(1, 6); // Jan to Jun 2025
                $loanDisburseDate = Carbon::create(2025, $loanMonth, 15);
                $principal = rand(2, 10) * 1000000;
                $tenorYears = rand(1, 2);
                $feePercentage = 1.5;
                $activeMonthsPerYear = 10;
                $totalTenorMonths = $tenorYears * $activeMonthsPerYear;
                
                $monthlyPrincipal = $principal / $totalTenorMonths;
                $monthlyFee = $principal * ($feePercentage / 100);

                $loan = Loan::create([
                    'user_id' => $member->id,
                    'principal_amount' => $principal,
                    'cooperative_fee_percentage' => $feePercentage,
                    'tenor_months' => $totalTenorMonths,
                    'tenor_years' => $tenorYears,
                    'monthly_principal_installment' => $monthlyPrincipal,
                    'current_remaining_principal' => $principal,
                    'current_year_monthly_fee' => $monthlyFee,
                    'status' => 'aktif',
                    'transfer_proof_path' => 'transfer_proofs/dummy.png',
                    'disbursed_at' => $loanDisburseDate,
                    'admin_verified_at' => $loanDisburseDate->copy()->subDays(2),
                    'admin_verified_by' => $pengurusId,
                    'created_at' => $loanDisburseDate->copy()->subDays(3),
                    'updated_at' => $loanDisburseDate,
                ]);

                // Initial disbursement mutation
                Mutation::create([
                    'user_id' => $member->id,
                    'type' => 'pencairan_pinjaman',
                    'amount' => $principal,
                    'balance_after' => 0,
                    'description' => 'Pencairan pinjaman #' . $loan->id,
                    'created_at' => $loanDisburseDate,
                ]);
            }

            // Simulate monthly cycle from Jan 2025 to May 2026
            while ($periodDate->format('Y-m') <= '2026-05') {
                $p = $periods[$periodDate->format('Y-m')];
                $isInactiveMonth = in_array($periodDate->month, [11, 12]);
                
                // Simpanan Wajib is every month
                $savingAmount = $member->monthly_simpanan_wajib;
                $balance += $savingAmount;

                Mutation::create([
                    'user_id' => $member->id,
                    'type' => 'simpanan',
                    'saving_type' => 'wajib',
                    'amount' => $savingAmount,
                    'balance_after' => $balance,
                    'description' => 'Simpanan wajib bulanan ' . $periodDate->format('F Y'),
                    'created_at' => $periodDate->copy()->endOfMonth(),
                ]);

                $loanPrincipal = 0;
                $loanFee = 0;

                // Angsuran happens if loan is active, and it's an active month, and current month >= disburse month
                if ($loan && $loan->status === 'aktif' && $periodDate->format('Y-m') >= $loan->disbursed_at->format('Y-m')) {
                    if (!$isInactiveMonth) {
                        $loanPrincipal = $loan->monthly_principal_installment;
                        $loanFee = $loan->current_year_monthly_fee;

                        $loan->current_remaining_principal -= $loanPrincipal;
                        if ($loan->current_remaining_principal <= 1) { // Floating point safety
                            $loan->current_remaining_principal = 0;
                            $loan->status = 'lunas';
                        }
                        $loan->save();

                        Mutation::create([
                            'user_id' => $member->id,
                            'type' => 'angsuran_pokok',
                            'amount' => $loanPrincipal,
                            'balance_after' => 0,
                            'description' => 'Angsuran pokok pinjaman #' . $loan->id,
                            'created_at' => $periodDate->copy()->endOfMonth(),
                        ]);

                        Mutation::create([
                            'user_id' => $member->id,
                            'type' => 'angsuran_jasa',
                            'amount' => $loanFee,
                            'balance_after' => 0,
                            'description' => 'Angsuran jasa pinjaman #' . $loan->id,
                            'created_at' => $periodDate->copy()->endOfMonth(),
                        ]);
                    }
                }

                DeductionDetail::create([
                    'deduction_period_id' => $p->id,
                    'user_id' => $member->id,
                    'loan_id' => $loan && $loan->status === 'aktif' ? $loan->id : null,
                    'simpanan_wajib_amount' => $savingAmount,
                    'loan_principal_amount' => $loanPrincipal,
                    'loan_fee_amount' => $loanFee,
                    'status' => 'berhasil',
                ]);

                $periodDate->addMonth();
            }

            $member->update(['simpanan_wajib_balance' => $balance]);

            // Some members also make a new pending loan in June 2026
            if (rand(1, 100) <= 15) { // 15% chance
                $statuses = ['diajukan', 'diverifikasi', 'menunggu_bendahara', 'menunggu_ketua'];
                $principal = rand(1, 5) * 1000000;
                Loan::create([
                    'user_id' => $member->id,
                    'principal_amount' => $principal,
                    'cooperative_fee_percentage' => 1.5,
                    'tenor_months' => 10,
                    'tenor_years' => 1,
                    'monthly_principal_installment' => $principal / 10,
                    'current_remaining_principal' => $principal,
                    'current_year_monthly_fee' => $principal * 0.015,
                    'status' => $statuses[array_rand($statuses)],
                    'created_at' => Carbon::create(2026, 6, rand(1, 15)),
                ]);
            }
        }
    }
}
