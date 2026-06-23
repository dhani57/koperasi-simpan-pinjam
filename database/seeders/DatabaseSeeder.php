<?php

namespace Database\Seeders;

use App\Models\DeductionDetail;
use App\Models\DeductionPeriod;
use App\Models\Loan;
use App\Models\Mutation;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
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

        // 2. Default Roles
        $adminUsers = [
            [
                'name' => 'Admin Pengurus',
                'email' => 'admin@koperasi.internal',
                'identity_number' => 'ADM-001',
                'password' => bcrypt('password'),
                'role' => 'pengurus',
                'monthly_saving_nominal' => 0,
                'max_salary_deduction_limit' => 0,
                'total_saving_balance' => 0,
            ],
            [
                'name' => 'Bapak Ketua',
                'email' => 'ketua@koperasi.internal',
                'identity_number' => 'ADM-002',
                'password' => bcrypt('password'),
                'role' => 'ketua',
                'monthly_saving_nominal' => 0,
                'max_salary_deduction_limit' => 0,
                'total_saving_balance' => 0,
            ],
            [
                'name' => 'Ibu Bendahara',
                'email' => 'bendahara@koperasi.internal',
                'identity_number' => 'ADM-003',
                'password' => bcrypt('password'),
                'role' => 'bendahara',
                'monthly_saving_nominal' => 0,
                'max_salary_deduction_limit' => 0,
                'total_saving_balance' => 0,
            ],
            [
                'name' => 'Bapak Pengawas',
                'email' => 'pengawas@koperasi.internal',
                'identity_number' => 'ADM-004',
                'password' => bcrypt('password'),
                'role' => 'pengawas',
                'monthly_saving_nominal' => 0,
                'max_salary_deduction_limit' => 0,
                'total_saving_balance' => 0,
            ]
        ];

        foreach ($adminUsers as $admin) {
            User::firstOrCreate(['email' => $admin['email']], $admin);
        }

        // 3. Regular Members (Anggota)
        $members = [];
        // Demo member
        $members[] = User::firstOrCreate(['email' => 'anggota@koperasi.internal'], [
            'name' => 'Anggota Biasa',
            'identity_number' => 'ANG-001',
            'password' => bcrypt('password'),
            'role' => 'anggota',
            'monthly_saving_nominal' => 100000,
            'max_salary_deduction_limit' => 2000000,
            'total_saving_balance' => 0,
        ]);

        // Generate 20 more members
        for ($i = 2; $i <= 21; $i++) {
            $members[] = User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'identity_number' => 'ANG-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'password' => bcrypt('password'),
                'role' => 'anggota',
                'monthly_saving_nominal' => fake()->randomElement([50000, 100000, 150000, 200000]),
                'max_salary_deduction_limit' => fake()->randomElement([1500000, 2000000, 2500000, 3000000]),
                'total_saving_balance' => 0,
            ]);
        }

        // 4. Mutations & Saving Balances
        foreach ($members as $member) {
            // Give them some initial savings
            $initialSaving = fake()->randomElement([1000000, 2000000, 5000000, 10000000]);
            
            Mutation::create([
                'user_id' => $member->id,
                'type' => 'simpanan',
                'amount' => $initialSaving,
                'balance_after' => $initialSaving,
                'description' => 'Migrasi Saldo Simpanan Sebelumnya',
                'created_at' => now()->subMonths(6)
            ]);

            $member->update(['total_saving_balance' => $initialSaving]);
        }

        // 5. Loans
        $loanStatuses = ['diajukan', 'disetujui', 'aktif', 'lunas', 'ditolak', 'menunggu_bendahara', 'menunggu_ketua'];
        $users = User::where('role', 'anggota')->get();
        $activeLoans = [];

        foreach ($users as $user) {
            // Memberikan 1-2 pinjaman history untuk tiap user
            $numLoans = rand(1, 2);
            for ($i = 0; $i < $numLoans; $i++) {
                $status = $loanStatuses[array_rand($loanStatuses)];
                $principal = rand(1, 15) * 1000000;
                $tenorYears = rand(1, 3);
                $feePercentage = 1.5;

                // Create loan record via service logic approximation
                // so active months logic is respected
                $activeMonthsPerYear = 10;
                $totalTenorMonths = $tenorYears * $activeMonthsPerYear;
                
                $monthlyPrincipal = $principal / $totalTenorMonths;
                $monthlyFee = $principal * ($feePercentage / 100);

                $loan = Loan::create([
                    'user_id' => $user->id,
                    'principal_amount' => $principal,
                    'cooperative_fee_percentage' => $feePercentage,
                    'tenor_months' => $totalTenorMonths,
                    'tenor_years' => $tenorYears,
                    'monthly_principal_installment' => $monthlyPrincipal,
                    'current_remaining_principal' => $status === 'lunas' ? 0 : $principal,
                    'current_year_monthly_fee' => $status === 'lunas' ? 0 : $monthlyFee,
                    'status' => $status,
                    'transfer_proof_path' => in_array($status, ['aktif', 'lunas']) ? 'transfer_proofs/dummy.png' : null,
                    'disbursed_at' => in_array($status, ['aktif', 'lunas']) ? now()->subMonths(3) : null,
                    'admin_verified_at' => in_array($status, ['disetujui', 'aktif', 'lunas', 'ditolak', 'menunggu_bendahara', 'menunggu_ketua']) ? now()->subMonths(4) : null,
                    'admin_verified_by' => in_array($status, ['disetujui', 'aktif', 'lunas', 'ditolak', 'menunggu_bendahara', 'menunggu_ketua']) ? User::where('role', 'pengurus')->first()->id : null,
                ]);

                if ($status === 'aktif') {
                    $activeLoans[] = $loan;
                }
            }
        }

        // 6. Deduction Periods and Details
        $months = [
            ['month' => now()->subMonth()->month, 'year' => now()->subMonth()->year, 'status' => 'selesai_divalidasi'],
            ['month' => now()->month, 'year' => now()->year, 'status' => 'draf'],
        ];

        foreach ($months as $m) {
            $period = DeductionPeriod::create([
                'month' => $m['month'],
                'year' => $m['year'],
                'status' => $m['status'],
                'is_active' => true,
            ]);

            // Add details for active loans in this period
            foreach ($activeLoans as $loan) {
                DeductionDetail::create([
                    'deduction_period_id' => $period->id,
                    'user_id' => $loan->user_id,
                    'loan_id' => $loan->id,
                    'routine_saving_amount' => $loan->user->monthly_saving_nominal,
                    'loan_principal_amount' => $loan->monthly_principal_installment,
                    'loan_fee_amount' => $loan->current_year_monthly_fee,
                    'status' => $m['status'] === 'selesai_divalidasi' ? 'berhasil' : 'menunggu',
                ]);
            }
            
            // Add details for members without active loans (only saving)
            foreach (array_slice($members, 15, 5) as $memberNoLoan) {
                DeductionDetail::create([
                    'deduction_period_id' => $period->id,
                    'user_id' => $memberNoLoan->id,
                    'loan_id' => null,
                    'routine_saving_amount' => $memberNoLoan->monthly_saving_nominal,
                    'loan_principal_amount' => 0,
                    'loan_fee_amount' => 0,
                    'status' => $m['status'] === 'selesai_divalidasi' ? 'berhasil' : 'menunggu',
                ]);
            }
        }
    }
}
