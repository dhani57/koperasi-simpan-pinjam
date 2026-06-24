<?php

namespace Tests\Unit;

use App\Models\Loan;
use App\Models\Setting;
use App\Models\User;
use App\Services\LoanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        Setting::create(['key' => 'inactive_months', 'value' => json_encode([6, 12]), 'type' => 'json']);
        Setting::create(['key' => 'loan_interest_rate', 'value' => '1.5', 'type' => 'float']);
    }

    public function test_get_active_months_per_year_returns_correct_count()
    {
        $service = new LoanService();
        $this->assertEquals(10, $service->getActiveMonthsPerYear());
    }

    public function test_calculate_simulation()
    {
        $service = new LoanService();
        $principal = 15000000;
        $tenorYears = 3;
        $feePercentage = 1.0; // using 1% just like PRD 6.2 example
        
        $simulation = $service->calculateSimulation($principal, $tenorYears, null, $feePercentage);
        
        $this->assertEquals(30, $simulation['total_tenor_months']);
        
        // Year 1
        $this->assertEquals(500000, $simulation['yearly_breakdown'][0]['monthly_principal']);
        $this->assertEquals(150000, $simulation['yearly_breakdown'][0]['monthly_fee']);
        $this->assertEquals(650000, $simulation['yearly_breakdown'][0]['monthly_total']);
        
        // Year 2
        $this->assertEquals(10000000, $simulation['yearly_breakdown'][1]['starting_principal']);
        $this->assertEquals(100000, $simulation['yearly_breakdown'][1]['monthly_fee']);
        
        // Year 3
        $this->assertEquals(5000000, $simulation['yearly_breakdown'][2]['starting_principal']);
        $this->assertEquals(50000, $simulation['yearly_breakdown'][2]['monthly_fee']);
    }

    public function test_advance_to_next_year()
    {
        $service = new LoanService();
        $user = User::factory()->create(['role' => 'anggota', 'identity_number' => 'NIP-12345']);
        $loan = $service->createLoan($user, 15000000, 3);
        
        $this->assertEquals(15000000, $loan->current_remaining_principal);
        
        // Manually simulate 1 year has passed
        // Year 2 should use starting principal of 10M
        $service->advanceToNextYear($loan, 2);
        
        $loan->refresh();
        $this->assertEquals(10000000, $loan->current_remaining_principal);
        // Fee = 1.5% of 10M = 150,000
        $this->assertEquals(150000, $loan->current_year_monthly_fee);
    }
}
