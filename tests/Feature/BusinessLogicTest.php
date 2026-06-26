<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessLogicTest extends TestCase
{
    use RefreshDatabase;

    public function test_annual_decreasing_service_fee_calculation()
    {
        // BIZ-01: Perhitungan jasa menurun tahunan
        Setting::updateOrCreate(['key' => 'loan_service_percentage'], ['value' => '1.5']);
        Setting::updateOrCreate(['key' => 'loan_max_tenor_months'], ['value' => '36']);
        Setting::updateOrCreate(['key' => 'inactive_months'], ['value' => json_encode([])]);

        $anggota = User::factory()->create([
            'role' => 'anggota',
            'monthly_saving_nominal' => 100000,
            'max_salary_deduction_limit' => 5000000
        ]);
        $this->actingAs($anggota);

        // Ajukan pinjaman 15 juta, 3 tahun (36 bulan), jasa 1.5%
        $response = $this->post('/member/loans', [
            'user_id' => $anggota->id,
            'principal_amount' => 15000000,
            'tenor_months' => 36,
            'tenor_years' => 3,
        ]);

        $response->assertSessionHas('success');
        $loan = \App\Models\Loan::where('user_id', $anggota->id)->first();
        
        $this->assertNotNull($loan);
        $this->assertEquals(15000000, $loan->principal_amount);
        
        // Cicilan pokok per bulan = 15.000.000 / 36 = 416666.67
        // Tahun 1: Jasa = 1.5% * 15.000.000 = 225.000
        // Total cicilan Tahun 1 = Pokok (416666.67) + Jasa (225000) = 641666.67
        
        // Cek current_year_monthly_fee pada saat inisiasi
        $this->assertEquals(225000, $loan->current_year_monthly_fee);

        // Untuk mengecek Rekalkulasi Tahun ke-2, panggil Service manual
        $service = new \App\Services\LoanService();
        $service->advanceToNextYear($loan, 2);

        $loan->refresh();
        // Tahun 2: Sisa pokok 10.000.000, Jasa = 1.5% * 10.000.000 = 150.000
        $this->assertEquals(150000, $loan->current_year_monthly_fee);

        // Tahun 3: Rekalkulasi Tahun ke-3
        $service->advanceToNextYear($loan, 3);
        $loan->refresh();
        
        // Tahun 3: Sisa pokok 5.000.000, Jasa = 1.5% * 5.000.000 = 75.000
        $this->assertEquals(75000, $loan->current_year_monthly_fee);
    }

    public function test_salary_deduction_limit_validation()
    {
        // BIZ-03: Validasi limit gaji
        Setting::updateOrCreate(['key' => 'loan_service_percentage'], ['value' => '1.5']);
        Setting::updateOrCreate(['key' => 'loan_max_tenor_months'], ['value' => '36']);

        $anggota = User::factory()->create([
            'role' => 'anggota',
            'monthly_saving_nominal' => 100000,
            'max_salary_deduction_limit' => 500000
        ]);
        $this->actingAs($anggota);

        // Coba ajukan pinjaman 15 juta selama 12 bulan (Cicilan Pokok ~1.25juta/bln + Jasa 225rb)
        // Total beban bulanan: 100.000 (simpanan) + 1.250.000 + 225.000 = 1.575.000
        // Ini lebih besar dari 500.000
        $response = $this->post('/member/loans', [
            'user_id' => $anggota->id,
            'principal_amount' => 15000000,
            'tenor_months' => 12,
            'tenor_years' => 1,
        ]);

        $response->assertSessionHasErrors();
        $this->assertStringContainsString('plafon gaji', strtolower(session('errors')->first()));
        
        // Pastikan tidak ada pinjaman yang terbuat
        $this->assertEquals(0, \App\Models\Loan::count());
    }

    public function test_shu_progressive_distribution()
    {
        // BIZ-02: SHU Berbasis Kontribusi Progresif
        $year = now()->year;

        // Buat 2 anggota dengan saldo simpanan awal
        $anggotaA = User::factory()->create(['role' => 'anggota', 'total_saving_balance' => 2000000]);
        $anggotaB = User::factory()->create(['role' => 'anggota', 'total_saving_balance' => 500000]);

        // Anggota A: Simpanan besar (2jt), Jasa Pinjaman kecil (0)
        \App\Models\Mutation::create([
            'user_id' => $anggotaA->id,
            'type' => 'simpanan_rutin',
            'amount' => 2000000,
            'balance_after' => 2000000,
            'description' => 'Simpanan',
            'created_at' => now()->startOfYear()
        ]);

        // Anggota B: Simpanan kecil (500rb), Jasa Pinjaman besar (1jt)
        \App\Models\Mutation::create([
            'user_id' => $anggotaB->id,
            'type' => 'simpanan_rutin',
            'amount' => 500000,
            'balance_after' => 500000,
            'description' => 'Simpanan',
            'created_at' => now()->startOfYear()
        ]);
        
        \App\Models\Mutation::create([
            'user_id' => $anggotaB->id,
            'type' => 'angsuran_jasa',
            'amount' => 1000000,
            'balance_after' => 500000,
            'description' => 'Angsuran Jasa',
            'created_at' => now()->startOfYear()
        ]);

        // Global Totals: 
        // Jasa = 1,000,000
        // Simpanan = 2,500,000
        // Profit = 1,000,000
        // SHU Dibagikan = 70% * 1,000,000 = 700,000
        // Porsi Simpanan (40%) = 280,000
        // Porsi Pinjaman (60%) = 420,000

        // Porsi A: 
        // Simpanan: (2jt / 2.5jt) * 280k = 224,000
        // Jasa: (0) * 420k = 0
        // Total A = 224,000

        // Porsi B:
        // Simpanan: (500k / 2.5jt) * 280k = 56,000
        // Jasa: (1jt / 1jt) * 420k = 420,000
        // Total B = 476,000

        $service = new \App\Services\ShuService();
        $result = $service->calculateEstimatedShu($year);

        $memberA_Shu = collect($result['member_proportions'])->firstWhere('user.id', $anggotaA->id);
        $memberB_Shu = collect($result['member_proportions'])->firstWhere('user.id', $anggotaB->id);

        $this->assertEquals(224000, $memberA_Shu['nominal_shu']);
        $this->assertEquals(476000, $memberB_Shu['nominal_shu']);

        // Uji eksekusi riil Distribusi (Mutasi terbuat)
        $ketua = User::factory()->create(['role' => 'ketua']);
        $this->actingAs($ketua);

        $response = $this->post("/admin/shu/approve?year={$year}");
        $response->assertRedirect();
        
        // Verifikasi mutasi distribusi SHU dibuat
        $mutasiA = \App\Models\Mutation::where('user_id', $anggotaA->id)
            ->where('type', 'shu_distribution')
            ->first();
        $this->assertNotNull($mutasiA);
        $this->assertEquals(224000, $mutasiA->amount);

        // Verifikasi saldo anggota bertambah
        $anggotaA->refresh();
        $this->assertEquals(2000000 + 224000, $anggotaA->total_saving_balance);
    }
}
