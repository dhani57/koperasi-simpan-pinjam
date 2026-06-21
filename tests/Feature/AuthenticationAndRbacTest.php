<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthenticationAndRbacTest extends TestCase
{
    use RefreshDatabase;

    public function test_auth_rate_limiting_blocks_brute_force_login()
    {
        // AUTH-02: Login dengan password salah berulang (Rate Limiting)
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        // Laravel default login rate limit is 5 attempts per minute
        for ($i = 0; $i < 5; $i++) {
            $response = $this->post('/login', [
                'identifier' => $user->email,
                'password' => 'wrongpassword',
            ]);
            $response->assertSessionHasErrors('identifier');
        }

        // 6th attempt should be blocked by rate limiter
        $response = $this->post('/login', [
            'identifier' => $user->email,
            'password' => 'wrongpassword',
        ]);
        
        // Assert response has Too Many Requests validation error
        $response->assertSessionHasErrors('identifier');
        $this->assertStringContainsString('Too many login attempts', session('errors')->first('identifier'));
    }

    public function test_anggota_cannot_access_admin_dashboard()
    {
        // AUTH-03: Akses dashboard role lain langsung lewat URL
        $anggota = User::factory()->create(['role' => 'anggota']);
        $this->actingAs($anggota);

        $response = $this->get('/admin/dashboard');

        // Should be forbidden (403)
        $response->assertStatus(403);
    }

    public function test_pengawas_has_read_only_access()
    {
        // PNG-02: Bypass UI lewat API langsung
        $pengawas = User::factory()->create(['role' => 'pengawas']);
        $this->actingAs($pengawas);

        // Can access dashboard
        $response = $this->get('/admin/dashboard');
        $response->assertStatus(200);

        // Cannot perform POST actions (e.g. settings)
        $response = $this->post('/admin/settings', [
            'inactive_months' => [1, 2]
        ]);
        
        $response->assertStatus(403);
    }
}
