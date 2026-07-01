<?php

namespace Tests\Feature;

use App\Models\Loan;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberLoanControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $anggota;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::create(['key' => 'inactive_months', 'value' => json_encode([6, 12]), 'type' => 'json']);
        Setting::create(['key' => 'loan_interest_rate', 'value' => '1.5', 'type' => 'float']);

        $this->anggota = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 5000000,
        ]);
    }

    public function test_anggota_can_view_loans_page()
    {
        $response = $this->actingAs($this->anggota)->get(route('member.loans.index'));
        $response->assertStatus(200);
    }

    public function test_anggota_can_view_loan_create_page()
    {
        $response = $this->actingAs($this->anggota)->get(route('member.loans.create'));
        $response->assertStatus(200);
    }

    public function test_anggota_can_submit_loan_application()
    {
        $response = $this->actingAs($this->anggota)->post(route('member.loans.store'), [
            'principal_amount' => 5000000,
            'tenor_type' => 'standar',
            'tenor_months' => 10,
            'purpose' => 'Kebutuhan pendidikan',
        ]);

        $response->assertSessionHas('success');
        $response->assertRedirect(route('member.loans.index'));

        $this->assertDatabaseHas('loans', [
            'user_id' => $this->anggota->id,
            'principal_amount' => 5000000,
            'status' => 'diajukan',
        ]);
    }

    public function test_member_can_top_up_active_loan()
    {
        // Buat pinjaman aktif terlebih dahulu
        Loan::create([
            'user_id' => $this->anggota->id,
            'principal_amount' => 3000000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 10,
            'tenor_years' => 1,
            'monthly_principal_installment' => 300000,
            'current_remaining_principal' => 3000000,
            'current_year_monthly_fee' => 45000,
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($this->anggota)->post(route('member.loans.store'), [
            'principal_amount' => 2000000,
            'tenor_type' => 'standar',
            'tenor_months' => 10,
            'purpose' => 'Top up pinjaman',
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals(2, Loan::where('user_id', $this->anggota->id)->count());
        $newLoan = Loan::where('user_id', $this->anggota->id)->where('status', 'diajukan')->first();
        $this->assertEquals(5000000, $newLoan->principal_amount);
    }

    public function test_rejected_if_has_pending_loan()
    {
        // Pinjaman dengan status diajukan
        Loan::create([
            'user_id' => $this->anggota->id,
            'principal_amount' => 3000000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 10,
            'tenor_years' => 1,
            'monthly_principal_installment' => 300000,
            'current_remaining_principal' => 3000000,
            'current_year_monthly_fee' => 45000,
            'status' => 'diajukan',
        ]);

        $response = $this->actingAs($this->anggota)->post(route('member.loans.store'), [
            'principal_amount' => 2000000,
            'tenor_type' => 'standar',
            'tenor_months' => 10,
        ]);

        $response->assertSessionHasErrors('principal_amount');
    }

    public function test_validation_fails_without_tenor()
    {
        $response = $this->actingAs($this->anggota)->post(route('member.loans.store'), [
            'principal_amount' => 5000000,
            // tenor_years dan tenor_months tidak diisi
        ]);

        $response->assertSessionHasErrors('tenor_type');
    }

    public function test_validation_fails_for_too_small_principal()
    {
        $response = $this->actingAs($this->anggota)->post(route('member.loans.store'), [
            'principal_amount' => 50000, // Di bawah minimum 100.000
            'tenor_type' => 'standar',
            'tenor_months' => 10,
        ]);

        $response->assertSessionHasErrors('principal_amount');
    }

    public function test_rejected_if_exceeds_salary_deduction_limit()
    {
        $memberLowLimit = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 200000, // Limit sangat rendah
        ]);

        $response = $this->actingAs($memberLowLimit)->post(route('member.loans.store'), [
            'principal_amount' => 15000000,
            'tenor_type' => 'standar',
            'tenor_months' => 10,
        ]);

        $response->assertSessionHasErrors('principal_amount');
        $this->assertEquals(0, Loan::where('user_id', $memberLowLimit->id)->count());
    }
}
