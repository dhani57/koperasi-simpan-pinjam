<?php

namespace Tests\Unit;

use App\Models\Mutation;
use App\Models\Setting;
use App\Models\User;
use App\Services\ShuService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShuServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ShuService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ShuService();
    }

    public function test_shu_distribution_proportional_calculation()
    {
        // Buat 2 anggota dengan transaksi berbeda
        $memberA = User::factory()->create(['role' => 'anggota', 'simpanan_sukarela_balance' => 500000]);
        $memberB = User::factory()->create(['role' => 'anggota', 'simpanan_sukarela_balance' => 300000]);

        $year = now()->year;

        // Member A: simpanan 500rb, jasa pinjaman 100rb
        Mutation::create([
            'user_id' => $memberA->id,
            'type' => 'simpanan_rutin',
            'amount' => 500000,
            'balance_after' => 500000,
            'description' => 'Simpanan rutin',
        ]);
        Mutation::create([
            'user_id' => $memberA->id,
            'type' => 'angsuran_jasa',
            'amount' => 100000,
            'balance_after' => 500000,
            'description' => 'Jasa pinjaman',
        ]);

        // Member B: simpanan 300rb, jasa pinjaman 50rb
        Mutation::create([
            'user_id' => $memberB->id,
            'type' => 'simpanan_rutin',
            'amount' => 300000,
            'balance_after' => 300000,
            'description' => 'Simpanan rutin',
        ]);
        Mutation::create([
            'user_id' => $memberB->id,
            'type' => 'angsuran_jasa',
            'amount' => 50000,
            'balance_after' => 300000,
            'description' => 'Jasa pinjaman',
        ]);

        $result = $this->service->calculateEstimatedShu($year);

        // Total jasa global = 150.000
        $this->assertEquals(150000, $result['total_global_jasa']);

        // Total simpanan global = 800.000
        $this->assertEquals(800000, $result['total_global_simpanan']);

        // Total profit (= total jasa) = 150.000
        // SHU dibagikan = 70% * 150.000 = 105.000
        $this->assertEquals(105000, $result['total_shu_dibagikan']);

        // Pool simpanan = 40% * 105.000 = 42.000
        // Pool jasa = 60% * 105.000 = 63.000

        // Member A: porsi simpanan = (500k / 800k) * 42k = 26.250
        //           porsi jasa = (100k / 150k) * 63k = 42.000
        //           total SHU = 68.250
        // Member B: porsi simpanan = (300k / 800k) * 42k = 15.750
        //           porsi jasa = (50k / 150k) * 63k = 21.000
        //           total SHU = 36.750

        $this->assertCount(2, $result['member_proportions']);

        // Sorted by highest nominal SHU, so A first
        $propA = $result['member_proportions'][0];
        $propB = $result['member_proportions'][1];

        $this->assertEquals($memberA->id, $propA['user']->id);
        $this->assertEquals(68250, $propA['nominal_shu']);
        $this->assertEquals(26250, $propA['porsi_simpanan']);
        $this->assertEquals(42000, $propA['porsi_pinjaman']);

        $this->assertEquals($memberB->id, $propB['user']->id);
        $this->assertEquals(36750, $propB['nominal_shu']);
        $this->assertEquals(15750, $propB['porsi_simpanan']);
        $this->assertEquals(21000, $propB['porsi_pinjaman']);
    }

    public function test_member_without_any_transaction_gets_zero_shu()
    {
        $member = User::factory()->create(['role' => 'anggota']);

        $result = $this->service->calculateEstimatedShu((string)now()->year);

        $this->assertCount(1, $result['member_proportions']);
        $this->assertEquals(0, $result['member_proportions'][0]['nominal_shu']);
        $this->assertEquals(0, $result['member_proportions'][0]['porsi_simpanan']);
        $this->assertEquals(0, $result['member_proportions'][0]['porsi_pinjaman']);
    }

    public function test_division_by_zero_guard_when_global_totals_are_zero()
    {
        // Anggota tanpa transaksi apapun
        $member = User::factory()->create(['role' => 'anggota']);

        $result = $this->service->calculateEstimatedShu((string)now()->year);

        // Harus tidak error (division by zero) dan SHU = 0
        $this->assertEquals(0, $result['total_global_jasa']);
        $this->assertEquals(0, $result['total_global_simpanan']);
        $this->assertEquals(0, $result['total_shu_dibagikan']);
        $this->assertEquals(0, $result['member_proportions'][0]['nominal_shu']);
    }

    public function test_calculate_estimated_shu_for_specific_user()
    {
        $member = User::factory()->create(['role' => 'anggota']);
        $year = (string)now()->year;

        Mutation::create([
            'user_id' => $member->id,
            'type' => 'simpanan_rutin',
            'amount' => 200000,
            'balance_after' => 200000,
            'description' => 'Simpanan',
        ]);
        Mutation::create([
            'user_id' => $member->id,
            'type' => 'angsuran_jasa',
            'amount' => 50000,
            'balance_after' => 200000,
            'description' => 'Jasa',
        ]);

        $result = $this->service->calculateEstimatedShuForUser($year, $member->id);

        $this->assertArrayHasKey('totalShu', $result);
        $this->assertArrayHasKey('porsiSimpanan', $result);
        $this->assertArrayHasKey('porsiPinjaman', $result);
        $this->assertArrayHasKey('persenKontribusiAset', $result);
        $this->assertGreaterThan(0, $result['totalShu']);
    }

    public function test_shu_for_nonexistent_user_returns_zero()
    {
        $member = User::factory()->create(['role' => 'anggota']);
        $year = (string)now()->year;

        $result = $this->service->calculateEstimatedShuForUser($year, 99999);

        $this->assertEquals(0, $result['totalShu']);
        $this->assertEquals(0, $result['porsiSimpanan']);
        $this->assertEquals(0, $result['porsiPinjaman']);
    }

    public function test_shu_sorted_by_highest_nominal()
    {
        $memberLow = User::factory()->create(['role' => 'anggota']);
        $memberHigh = User::factory()->create(['role' => 'anggota']);

        $year = (string)now()->year;

        Mutation::create([
            'user_id' => $memberLow->id,
            'type' => 'angsuran_jasa',
            'amount' => 10000,
            'balance_after' => 0,
            'description' => 'Jasa kecil',
        ]);
        Mutation::create([
            'user_id' => $memberHigh->id,
            'type' => 'angsuran_jasa',
            'amount' => 100000,
            'balance_after' => 0,
            'description' => 'Jasa besar',
        ]);

        $result = $this->service->calculateEstimatedShu($year);

        // Highest SHU first
        $this->assertEquals($memberHigh->id, $result['member_proportions'][0]['user']->id);
        $this->assertEquals($memberLow->id, $result['member_proportions'][1]['user']->id);
    }
}
