<?php

namespace Tests\Feature;

use App\Jobs\ProcessMonthlyDeduction;
use App\Models\DeductionPeriod;
use App\Models\DeductionDetail;
use App\Models\Loan;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MonthlyDeductionJobTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        Setting::create(['key' => 'inactive_months', 'value' => json_encode([6, 12]), 'type' => 'json']);
    }

    public function test_inactive_month_skips_deductions()
    {
        $period = DeductionPeriod::create(['month' => 6, 'year' => 2026, 'status' => 'draf']);
        
        $job = new ProcessMonthlyDeduction($period);
        $job->handle(new \App\Services\DeductionService());

        $period->refresh();
        $this->assertEquals(false, $period->is_active);
        $this->assertEquals('selesai_divalidasi', $period->status);
        
        $this->assertEquals(0, DeductionDetail::where('deduction_period_id', $period->id)->count());
    }

    public function test_active_month_processes_deductions_correctly()
    {
        $member = User::factory()->create(['role' => 'anggota', 'monthly_saving_nominal' => 100000]);
        $loan = Loan::create([
            'user_id' => $member->id,
            'principal_amount' => 1000000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 10,
            'tenor_years' => 1,
            'monthly_principal_installment' => 100000,
            'current_remaining_principal' => 1000000,
            'current_year_monthly_fee' => 15000,
            'status' => 'aktif'
        ]);

        $period = DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'draf']);
        
        $job = new ProcessMonthlyDeduction($period);
        $job->handle(new \App\Services\DeductionService());

        $period->refresh();
        $this->assertEquals(true, $period->is_active);
        
        $detail = DeductionDetail::where('deduction_period_id', $period->id)->where('user_id', $member->id)->first();
        $this->assertNotNull($detail);
        $this->assertEquals($loan->id, $detail->loan_id);
        $this->assertEquals(100000, $detail->routine_saving_amount);
        $this->assertEquals(100000, $detail->loan_principal_amount);
        $this->assertEquals(15000, $detail->loan_fee_amount);
        $this->assertEquals('menunggu', $detail->status);
    }
}
