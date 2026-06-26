<?php

namespace Tests\Unit;

use App\Models\Setting;
use App\Services\DeductionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeductionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected DeductionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new DeductionService();
    }

    public function test_active_month_returns_true()
    {
        Setting::create(['key' => 'inactive_months', 'value' => json_encode([6, 12]), 'type' => 'json']);

        // Bulan 1 (Januari) → aktif
        $this->assertTrue($this->service->isMonthActive(1));
        // Bulan 5 (Mei) → aktif
        $this->assertTrue($this->service->isMonthActive(5));
        // Bulan 7 (Juli) → aktif
        $this->assertTrue($this->service->isMonthActive(7));
    }

    public function test_inactive_month_returns_false()
    {
        Setting::create(['key' => 'inactive_months', 'value' => json_encode([6, 12]), 'type' => 'json']);

        // Bulan 6 (Juni) → non-aktif
        $this->assertFalse($this->service->isMonthActive(6));
        // Bulan 12 (Desember) → non-aktif
        $this->assertFalse($this->service->isMonthActive(12));
    }

    public function test_all_months_active_when_no_inactive_setting()
    {
        // Tidak ada setting inactive_months → semua bulan aktif
        for ($month = 1; $month <= 12; $month++) {
            $this->assertTrue($this->service->isMonthActive($month), "Month {$month} should be active when no setting exists");
        }
    }

    public function test_all_months_active_when_inactive_months_is_empty_array()
    {
        Setting::create(['key' => 'inactive_months', 'value' => json_encode([]), 'type' => 'json']);

        for ($month = 1; $month <= 12; $month++) {
            $this->assertTrue($this->service->isMonthActive($month), "Month {$month} should be active when inactive_months is empty");
        }
    }
}
