<?php

namespace App\Jobs;

use App\Models\DeductionDetail;
use App\Models\DeductionPeriod;
use App\Models\Loan;
use App\Models\User;
use App\Services\DeductionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessMonthlyDeduction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 1200; // 20 minutes timeout for large datasets

    protected DeductionPeriod $period;

    /**
     * Create a new job instance.
     */
    public function __construct(DeductionPeriod $period)
    {
        $this->period = $period;
    }

    /**
     * Execute the job.
     */
    public function handle(DeductionService $deductionService): void
    {
        Log::info("Starting deduction process for period: {$this->period->month}/{$this->period->year}");

        $isMonthActive = $deductionService->isMonthActive($this->period->month);

        if (!$isMonthActive) {
            $this->period->update([
                'is_active' => false,
                'status' => 'selesai'
            ]);
            Log::info("Month {$this->period->month} is inactive. Skipping deductions.");
            return;
        }

        DB::beginTransaction();
        try {
            // Process chunked to avoid memory bloat
            User::where('role', 'anggota')->chunk(200, function ($members) {
                $detailsToInsert = [];

                foreach ($members as $member) {
                    $simpananWajibAmount = $member->monthly_simpanan_wajib;
                    $simpananSukarelaAmount = $member->monthly_simpanan_sukarela;
                    
                    // Skip members who have retired or have failed debit (unless they manually fix it)
                    if ($member->has_failed_debit) {
                        continue;
                    }
                    if ($member->isRetiredByDate($this->period->month, $this->period->year)) {
                        continue;
                    }
                    
                    // Get active loans
                    $activeLoans = Loan::where('user_id', $member->id)->where('status', 'aktif')->get();

                    if ($activeLoans->isEmpty()) {
                        // If no loan, just insert savings
                        if ($simpananWajibAmount > 0 || $simpananSukarelaAmount > 0) {
                            $detailsToInsert[] = [
                                'deduction_period_id' => $this->period->id,
                                'user_id' => $member->id,
                                'loan_id' => null,
                                'simpanan_wajib_amount' => $simpananWajibAmount,
                                'simpanan_sukarela_amount' => $simpananSukarelaAmount,
                                'admin_fee_amount' => 0,
                                'loan_principal_amount' => 0,
                                'loan_fee_amount' => 0,
                                'status' => 'menunggu',
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    } else {
                        // Insert a row for each active loan so it's traceable per loan
                        foreach ($activeLoans as $index => $loan) {
                            // Only first loan record carries the routine saving to avoid duplicate saving deduction
                            $wajibForThisRow = ($index === 0) ? $simpananWajibAmount : 0;
                            $sukarelaForThisRow = ($index === 0) ? $simpananSukarelaAmount : 0;
                            
                            $detailsToInsert[] = [
                                'deduction_period_id' => $this->period->id,
                                'user_id' => $member->id,
                                'loan_id' => $loan->id,
                                'simpanan_wajib_amount' => $wajibForThisRow,
                                'simpanan_sukarela_amount' => $sukarelaForThisRow,
                                'admin_fee_amount' => 0,
                                'loan_principal_amount' => $loan->monthly_principal_installment,
                                'loan_fee_amount' => $loan->current_year_monthly_fee,
                                'status' => 'menunggu',
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    }
                }

                if (!empty($detailsToInsert)) {
                    DeductionDetail::insert($detailsToInsert);
                }
            });

            $this->period->update(['status' => 'draf']);
            DB::commit();
            Log::info("Successfully generated deduction details for period {$this->period->month}/{$this->period->year}");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to generate deduction details: " . $e->getMessage());
            throw $e;
        }
    }
}
