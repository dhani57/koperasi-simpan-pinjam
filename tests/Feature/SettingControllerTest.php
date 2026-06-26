<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_pengurus_can_save_settings()
    {
        $pengurus = User::factory()->create(['role' => 'pengurus']);

        $response = $this->actingAs($pengurus)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 150000,
            'default_salary_limit' => 3000000,
            'loan_interest_rate' => 2.0,
            'inactive_months' => [6, 12],
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('settings', [
            'key' => 'default_monthly_saving',
            'value' => '150000',
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'default_salary_limit',
            'value' => '3000000',
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'loan_interest_rate',
            'value' => '2',
        ]);
    }

    public function test_pengurus_can_save_settings_with_empty_inactive_months()
    {
        $pengurus = User::factory()->create(['role' => 'pengurus']);

        $response = $this->actingAs($pengurus)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 100000,
            'default_salary_limit' => 2000000,
            'loan_interest_rate' => 1.5,
            'inactive_months' => [],
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('settings', [
            'key' => 'inactive_months',
            'value' => json_encode([]),
        ]);
    }

    public function test_validation_fails_for_non_numeric_saving()
    {
        $pengurus = User::factory()->create(['role' => 'pengurus']);

        $response = $this->actingAs($pengurus)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 'bukan angka',
            'default_salary_limit' => 2000000,
            'loan_interest_rate' => 1.5,
        ]);

        $response->assertSessionHasErrors('default_monthly_saving');
    }

    public function test_validation_fails_for_interest_rate_above_100()
    {
        $pengurus = User::factory()->create(['role' => 'pengurus']);

        $response = $this->actingAs($pengurus)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 100000,
            'default_salary_limit' => 2000000,
            'loan_interest_rate' => 150,
        ]);

        $response->assertSessionHasErrors('loan_interest_rate');
    }

    public function test_validation_fails_for_inactive_months_out_of_range()
    {
        $pengurus = User::factory()->create(['role' => 'pengurus']);

        $response = $this->actingAs($pengurus)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 100000,
            'default_salary_limit' => 2000000,
            'loan_interest_rate' => 1.5,
            'inactive_months' => [13], // Bulan 13 tidak valid
        ]);

        $response->assertSessionHasErrors('inactive_months.0');
    }

    public function test_pengawas_cannot_post_settings()
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);

        $response = $this->actingAs($pengawas)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 100000,
            'default_salary_limit' => 2000000,
            'loan_interest_rate' => 1.5,
            'inactive_months' => [1, 2],
        ]);

        $response->assertStatus(403);
    }

    public function test_bendahara_cannot_post_settings()
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);

        $response = $this->actingAs($bendahara)->post(route('admin.settings.store'), [
            'default_monthly_saving' => 100000,
            'default_salary_limit' => 2000000,
            'loan_interest_rate' => 1.5,
        ]);

        $response->assertStatus(403);
    }

    public function test_pengawas_can_view_settings_page()
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);

        $response = $this->actingAs($pengawas)->get(route('admin.settings.index'));

        $response->assertStatus(200);
    }
}
