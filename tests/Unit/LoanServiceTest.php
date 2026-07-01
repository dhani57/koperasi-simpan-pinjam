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

    public function test_validate_limit_passes_when_within_limit()
    {
        $service = new LoanService();
        $user = User::factory()->create([
            'role' => 'anggota',
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 5000000,
        ]);

        // Cicilan bulan pertama = 500.000 (di bawah sisa limit 4.900.000)
        $this->assertTrue($service->validateLimit($user, 500000));
    }

    public function test_validate_limit_fails_when_exceeds_limit()
    {
        $service = new LoanService();
        $user = User::factory()->create([
            'role' => 'anggota',
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 500000,
        ]);

        // Cicilan 1.500.000 > sisa limit (500k - 100k = 400k)
        $this->assertFalse($service->validateLimit($user, 1500000));
    }

    public function test_create_loan_creates_loan_and_annual_service_record()
    {
        $service = new LoanService();
        $user = User::factory()->create(['role' => 'anggota']);

        $loan = $service->createLoan($user, 10000000, 2);

        $this->assertNotNull($loan);
        $this->assertEquals('diajukan', $loan->status);
        $this->assertEquals(10000000, $loan->principal_amount);
        $this->assertEquals(10000000, $loan->current_remaining_principal);

        // LoanAnnualService year 1 harus terbuat
        $annualService = \App\Models\LoanAnnualService::where('loan_id', $loan->id)->first();
        $this->assertNotNull($annualService);
        $this->assertEquals(1, $annualService->year_number);
        $this->assertEquals(10000000, $annualService->starting_remaining_principal);
    }

    public function test_advance_to_next_year_marks_loan_lunas_when_principal_depleted()
    {
        $service = new LoanService();
        $user = User::factory()->create(['role' => 'anggota']);

        // Buat pinjaman 1 tahun (10 bulan aktif)
        $loan = $service->createLoan($user, 5000000, 1);

        // Advance ke tahun 2 → sisa pokok harus 0, status lunas
        $service->advanceToNextYear($loan, 2);

        $loan->refresh();
        $this->assertEquals(0, $loan->current_remaining_principal);
        $this->assertEquals(0, $loan->current_year_monthly_fee);
        $this->assertEquals('lunas', $loan->status);
    }
}
