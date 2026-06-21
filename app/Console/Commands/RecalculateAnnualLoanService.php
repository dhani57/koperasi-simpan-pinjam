<?php

namespace App\Console\Commands;

use App\Models\DeductionDetail;
use App\Models\Loan;
use App\Models\LoanAnnualService;
use App\Services\LoanService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RecalculateAnnualLoanService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'koperasi:recalculate-annual-loan-service';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate loan annual service fee for loans entering a new year of tenor';

    /**
     * Execute the console command.
     */
    public function handle(LoanService $loanService)
    {
        $this->info('Starting recalculation of annual loan services...');
        Log::info('Starting recalculation of annual loan services');

        $activeMonths = $loanService->getActiveMonthsPerYear();
        
        $activeLoans = Loan::where('status', 'aktif')->get();
        $recalculatedCount = 0;

        foreach ($activeLoans as $loan) {
            $paidCount = DeductionDetail::where('loan_id', $loan->id)->where('status', 'berhasil')->count();
            
            // if paidCount is 10, expectedYear = floor(10/10) + 1 = 2
            $expectedYear = floor($paidCount / $activeMonths) + 1;
            
            $currentYearRecord = LoanAnnualService::where('loan_id', $loan->id)
                ->orderBy('year_number', 'desc')
                ->first();
            
            if ($currentYearRecord && $expectedYear > $currentYearRecord->year_number) {
                // Ensure we haven't exceeded the loan's tenor years
                if ($expectedYear <= $loan->tenor_years) {
                    $loanService->advanceToNextYear($loan, (int)$expectedYear);
                    $recalculatedCount++;
                    Log::info("Loan {$loan->id} advanced to year {$expectedYear}");
                }
            }
        }

        $this->info("Recalculation finished. {$recalculatedCount} loans updated.");
        Log::info("Recalculation finished. {$recalculatedCount} loans updated.");
    }
}
