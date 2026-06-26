<?php

namespace Tests\Feature;

use App\Models\DeductionDetail;
use App\Models\DeductionPeriod;
use App\Models\Loan;
use App\Models\Mutation;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class DeductionWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $bendahara;
    protected User $pengawas;
    protected User $pengurus;
    protected User $anggota;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::create(['key' => 'inactive_months', 'value' => json_encode([6, 12]), 'type' => 'json']);

        $this->bendahara = User::factory()->create(['role' => 'bendahara']);
        $this->pengawas = User::factory()->create(['role' => 'pengawas']);
        $this->pengurus = User::factory()->create(['role' => 'pengurus']);
        $this->anggota = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
            'monthly_saving_nominal' => 100000,
            'total_saving_balance' => 0,
        ]);
    }

    // --- RBAC Tests ---

    public function test_bendahara_can_view_deductions_index()
    {
        $response = $this->actingAs($this->bendahara)->get(route('admin.deductions.index'));
        $response->assertStatus(200);
    }

    public function test_pengawas_can_view_deductions_index()
    {
        $response = $this->actingAs($this->pengawas)->get(route('admin.deductions.index'));
        $response->assertStatus(200);
    }

    public function test_pengurus_cannot_view_deductions_index()
    {
        $response = $this->actingAs($this->pengurus)->get(route('admin.deductions.index'));
        $response->assertStatus(403);
    }

    public function test_anggota_cannot_view_deductions_index()
    {
        $response = $this->actingAs($this->anggota)->get(route('admin.deductions.index'));
        $response->assertStatus(403);
    }

    public function test_pengawas_cannot_store_deduction()
    {
        $response = $this->actingAs($this->pengawas)->post(route('admin.deductions.store'), [
            'period_date' => '2026-05-01',
        ]);
        $response->assertStatus(403);
    }

    // --- Store Tests ---

    public function test_bendahara_can_generate_deduction_period()
    {
        Queue::fake();

        $response = $this->actingAs($this->bendahara)->post(route('admin.deductions.store'), [
            'period_date' => '2026-05-01',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('deduction_periods', [
            'month' => 5,
            'year' => 2026,
            'status' => 'proses',
        ]);

        Queue::assertPushed(\App\Jobs\ProcessMonthlyDeduction::class);
    }

    public function test_duplicate_period_is_rejected()
    {
        DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'selesai']);

        $response = $this->actingAs($this->bendahara)->post(route('admin.deductions.store'), [
            'period_date' => '2026-05-01',
        ]);

        $response->assertSessionHas('error');
        $this->assertEquals(1, DeductionPeriod::where('month', 5)->where('year', 2026)->count());
    }

    // --- markAsSelesai Tests ---

    public function test_mark_as_selesai_updates_details_and_creates_mutations()
    {
        $period = DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'draf', 'is_active' => true]);

        $loan = Loan::create([
            'user_id' => $this->anggota->id,
            'principal_amount' => 1000000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 10,
            'tenor_years' => 1,
            'monthly_principal_installment' => 100000,
            'current_remaining_principal' => 1000000,
            'current_year_monthly_fee' => 15000,
            'status' => 'aktif',
        ]);

        DeductionDetail::create([
            'deduction_period_id' => $period->id,
            'user_id' => $this->anggota->id,
            'loan_id' => $loan->id,
            'routine_saving_amount' => 100000,
            'loan_principal_amount' => 100000,
            'loan_fee_amount' => 15000,
            'status' => 'menunggu',
        ]);

        $response = $this->actingAs($this->bendahara)
            ->patch(route('admin.deductions.selesai', $period->id));

        $response->assertSessionHas('success');

        // Period status → selesai
        $this->assertEquals('selesai', $period->fresh()->status);

        // Detail status → berhasil
        $detail = DeductionDetail::where('deduction_period_id', $period->id)->first();
        $this->assertEquals('berhasil', $detail->status);

        // Saldo user bertambah 100.000 (simpanan rutin)
        $this->assertEquals(100000, $this->anggota->fresh()->total_saving_balance);

        // 3 mutasi tercatat: simpanan_rutin, angsuran_pokok, angsuran_jasa
        $this->assertDatabaseHas('mutations', [
            'user_id' => $this->anggota->id,
            'type' => 'simpanan_rutin',
            'amount' => 100000,
        ]);
        $this->assertDatabaseHas('mutations', [
            'user_id' => $this->anggota->id,
            'type' => 'angsuran_pokok',
            'amount' => 100000,
        ]);
        $this->assertDatabaseHas('mutations', [
            'user_id' => $this->anggota->id,
            'type' => 'angsuran_jasa',
            'amount' => 15000,
        ]);

        // Loan remaining principal berkurang
        $this->assertEquals(900000, $loan->fresh()->current_remaining_principal);
    }

    public function test_mark_as_selesai_auto_marks_loan_as_lunas()
    {
        $period = DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'draf', 'is_active' => true]);

        $loan = Loan::create([
            'user_id' => $this->anggota->id,
            'principal_amount' => 100000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 1,
            'tenor_years' => 1,
            'monthly_principal_installment' => 100000,
            'current_remaining_principal' => 100000, // Tepat sisa 1 kali cicilan
            'current_year_monthly_fee' => 1500,
            'status' => 'aktif',
        ]);

        DeductionDetail::create([
            'deduction_period_id' => $period->id,
            'user_id' => $this->anggota->id,
            'loan_id' => $loan->id,
            'routine_saving_amount' => 100000,
            'loan_principal_amount' => 100000,
            'loan_fee_amount' => 1500,
            'status' => 'menunggu',
        ]);

        $this->actingAs($this->bendahara)
            ->patch(route('admin.deductions.selesai', $period->id));

        $loan->refresh();
        $this->assertEquals(0, $loan->current_remaining_principal);
        $this->assertEquals('lunas', $loan->status);
    }

    public function test_mark_as_selesai_rejects_already_completed_period()
    {
        $period = DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'selesai', 'is_active' => true]);

        $response = $this->actingAs($this->bendahara)
            ->patch(route('admin.deductions.selesai', $period->id));

        $response->assertSessionHas('error');
    }

    public function test_pengawas_cannot_mark_as_selesai()
    {
        $period = DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'draf', 'is_active' => true]);

        $response = $this->actingAs($this->pengawas)
            ->patch(route('admin.deductions.selesai', $period->id));

        $response->assertStatus(403);
    }

    public function test_mark_as_selesai_handles_saving_only_without_loan()
    {
        $period = DeductionPeriod::create(['month' => 5, 'year' => 2026, 'status' => 'draf', 'is_active' => true]);

        // Detail tanpa pinjaman (hanya simpanan)
        DeductionDetail::create([
            'deduction_period_id' => $period->id,
            'user_id' => $this->anggota->id,
            'loan_id' => null,
            'routine_saving_amount' => 100000,
            'loan_principal_amount' => 0,
            'loan_fee_amount' => 0,
            'status' => 'menunggu',
        ]);

        $response = $this->actingAs($this->bendahara)
            ->patch(route('admin.deductions.selesai', $period->id));

        $response->assertSessionHas('success');

        // Saldo user bertambah
        $this->assertEquals(100000, $this->anggota->fresh()->total_saving_balance);

        // Hanya 1 mutasi (simpanan_rutin), tidak ada angsuran
        $this->assertEquals(1, Mutation::where('user_id', $this->anggota->id)->count());
        $this->assertDatabaseHas('mutations', [
            'user_id' => $this->anggota->id,
            'type' => 'simpanan_rutin',
        ]);
    }
}
