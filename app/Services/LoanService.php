<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\LoanAnnualService;
use App\Models\Setting;
use App\Models\User;

class LoanService
{
    /**
     * Get the number of active months in a year based on settings
     */
    public function getActiveMonthsPerYear(): int
    {
        $inactiveMonthsSetting = Setting::where('key', 'inactive_months')->value('value');
        $inactiveMonths = $inactiveMonthsSetting ? json_decode($inactiveMonthsSetting, true) : [];
        return 12 - count($inactiveMonths);
    }

    /**
     * Calculate simulation for a loan
     *
     * @param float $principal
     * @param int $tenorMonths (this is the calendar months, but we treat it as total active deduction months if the user input is already in active months, or wait, PRD says: tenor tahun * 10 = total bulan tenor).
     * Actually, if a user inputs 3 years, the tenor_months should be 3 * active_months.
     * Let's accept $tenorYears.
     */
    public function calculateSimulation(float $principal, ?int $tenorYears, ?int $customTenorMonths, float $feePercentage, ?float $adminFeeOverride = null): array
    {
        $activeMonthsPerYear = $this->getActiveMonthsPerYear();
        
        $totalTenorMonths = $customTenorMonths ?? ($tenorYears * $activeMonthsPerYear);
        $computedTenorYears = $tenorYears ?? ceil($totalTenorMonths / $activeMonthsPerYear);

        $monthlyPrincipal = $principal / $totalTenorMonths;
        $simulation = [];
        $remainingPrincipal = $principal;

        for ($year = 1; $year <= $computedTenorYears; $year++) {
            $monthsInThisYear = min($activeMonthsPerYear, $totalTenorMonths - ($year - 1) * $activeMonthsPerYear);
            
            $monthlyFee = $remainingPrincipal * ($feePercentage / 100);
            $monthlyTotal = $monthlyPrincipal + $monthlyFee;
            
            $simulation[] = [
                'year' => $year,
                'starting_principal' => $remainingPrincipal,
                'monthly_principal' => $monthlyPrincipal,
                'monthly_fee' => $monthlyFee,
                'monthly_total' => $monthlyTotal,
                'active_months' => $monthsInThisYear,
                'year_total_payment' => $monthlyTotal * $monthsInThisYear
            ];

            $remainingPrincipal -= ($monthlyPrincipal * $monthsInThisYear);
        }

        $adminFee = $adminFeeOverride !== null ? $adminFeeOverride : min($principal * 0.01, 250000);

        return [
            'principal' => $principal,
            'admin_fee' => $adminFee,
            'tenor_years' => $computedTenorYears,
            'total_tenor_months' => $totalTenorMonths,
            'yearly_breakdown' => $simulation
        ];
    }

    /**
     * Validate if the user's limit allows this loan
     */
    public function validateLimit(User $user, float $firstYearMonthlyInstallment): bool
    {
        $activeLoans = Loan::where('user_id', $user->id)->whereIn('status', ['disetujui', 'aktif'])->get();
        $totalLoanInstallments = 0;
        foreach ($activeLoans as $loan) {
            $totalLoanInstallments += ($loan->monthly_principal_installment + $loan->current_year_monthly_fee);
        }
        
        $availableLimit = $user->max_salary_deduction_limit - ($user->monthly_simpanan_wajib + $totalLoanInstallments);
        
        return $firstYearMonthlyInstallment <= $availableLimit;
    }

    /**
     * Check if requested principal is within the max limit (50.000.000)
     */
    public function validateMaxPrincipal(float $principal): bool
    {
        return $principal <= 50000000;
    }

    /**
     * Create a new loan with its first year service record
     */
    public function createLoan(User $user, float $principal, ?int $tenorYears, ?int $customTenorMonths = null, ?string $purpose = null, ?float $adminFeeOverride = null, ?int $mergedFromLoanId = null, ?float $mergedOldRemaining = 0): Loan
    {
        if (!$this->validateMaxPrincipal($principal)) {
            throw new \Exception('Pinjaman melebihi batas maksimal Rp 50.000.000');
        }

        $feePercentage = Setting::where('key', 'loan_interest_rate')->value('value') ?? 1.5;
        $simulation = $this->calculateSimulation($principal, $tenorYears, $customTenorMonths, (float)$feePercentage, $adminFeeOverride);
        
        $firstYear = $simulation['yearly_breakdown'][0];
        
        $loan = Loan::create([
            'user_id' => $user->id,
            'principal_amount' => $principal,
            'purpose' => $purpose,
            'cooperative_fee_percentage' => $feePercentage,
            'admin_fee_amount' => $simulation['admin_fee'],
            'admin_fee_overridden' => $adminFeeOverride !== null,
            'tenor_months' => $simulation['total_tenor_months'],
            'tenor_years' => $simulation['tenor_years'],
            'monthly_principal_installment' => $firstYear['monthly_principal'],
            'current_remaining_principal' => $principal,
            'current_year_monthly_fee' => $firstYear['monthly_fee'],
            'status' => 'diajukan',
            'merged_from_loan_id' => $mergedFromLoanId,
            'merged_old_remaining' => $mergedOldRemaining
        ]);

        // Create first year annual service record
        LoanAnnualService::create([
            'loan_id' => $loan->id,
            'year_number' => 1,
            'starting_remaining_principal' => $principal,
            'monthly_fee' => $firstYear['monthly_fee']
        ]);

        return $loan;
    }

    /**
     * Advance loan to the next year (Recalculate fee)
     * Called by a Command/Job when a loan has been paid for $activeMonthsPerYear times in the current year.
     */
    public function advanceToNextYear(Loan $loan, int $nextYearNumber): void
    {
        // Update current remaining principal based on what should be left
        // Sisa Pokok Awal Tahun ke-(n+1) = Sisa Pokok Awal Tahun ke-n − (Cicilan Pokok per Bulan × 10)
        $activeMonths = $this->getActiveMonthsPerYear();
        $principalPaidInYear = $loan->monthly_principal_installment * $activeMonths;
        
        $newRemainingPrincipal = $loan->current_remaining_principal - $principalPaidInYear;
        
        if ($newRemainingPrincipal <= 0) {
            $loan->update(['status' => 'lunas', 'current_remaining_principal' => 0, 'current_year_monthly_fee' => 0]);
            return;
        }

        $newMonthlyFee = $newRemainingPrincipal * ($loan->cooperative_fee_percentage / 100);

        $loan->update([
            'current_remaining_principal' => $newRemainingPrincipal,
            'current_year_monthly_fee' => $newMonthlyFee
        ]);

        LoanAnnualService::create([
            'loan_id' => $loan->id,
            'year_number' => $nextYearNumber,
            'starting_remaining_principal' => $newRemainingPrincipal,
            'monthly_fee' => $newMonthlyFee
        ]);
    }
}
