<?php

namespace Tests\Feature;

use App\Models\Loan;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        Setting::updateOrCreate(['key' => 'loan_service_percentage'], ['value' => '1.5']);
        Setting::updateOrCreate(['key' => 'loan_max_tenor_months'], ['value' => '36']);

        $this->anggota = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
        ]);

        $this->pengurus = User::factory()->create([
            'role' => 'pengurus',
            'is_anggota' => false,
        ]);

        $this->ketua = User::factory()->create([
            'role' => 'ketua',
            'is_anggota' => false,
        ]);

        $this->bendahara = User::factory()->create([
            'role' => 'bendahara',
            'is_anggota' => false,
        ]);

        $this->loan = Loan::factory()->create([
            'user_id' => $this->anggota->id,
            'status' => 'diajukan',
            'principal_amount' => 5000000,
        ]);
    }

    public function test_pengurus_can_verify_loan(): void
    {
        $response = $this->actingAs($this->pengurus)->post(route('admin.loans.verify', $this->loan->id), [
            'notes' => 'Verified by pengurus',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertNotNull($this->loan->fresh()->admin_verified_at);
        $this->assertEquals('diajukan', $this->loan->fresh()->status);
    }

    public function test_ketua_can_approve_verified_loan(): void
    {
        $this->loan->update(['admin_verified_at' => now()]);

        $response = $this->actingAs($this->ketua)->post(route('admin.loans.approve', $this->loan->id), [
            'notes' => 'Approved by ketua',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('menunggu_bendahara', $this->loan->fresh()->status);
    }

    public function test_bendahara_can_disburse_approved_loan(): void
    {
        $this->loan->update(['status' => 'disetujui']);

        $response = $this->actingAs($this->bendahara)->post(route('admin.loans.disburse', $this->loan->id), [
            'notes' => 'Disbursed by bendahara',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('aktif', $this->loan->fresh()->status);
    }

    public function test_unauthorized_roles_cannot_skip_workflow(): void
    {
        // Pengurus cannot approve
        $response = $this->actingAs($this->pengurus)->post(route('admin.loans.approve', $this->loan->id), [
            'notes' => 'Approve try',
        ]);
        $response->assertStatus(403);
        $this->assertNull($this->loan->fresh()->ketua_approved_at);

        // Ketua cannot verify
        $this->loan->update(['status' => 'diajukan']);
        $response = $this->actingAs($this->ketua)->post(route('admin.loans.verify', $this->loan->id), [
            'notes' => 'Verify try',
        ]);
        $response->assertStatus(403);
        $this->assertEquals('diajukan', $this->loan->fresh()->status);
    }
}
