<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DualRoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_dual_role_admin_redirects_to_admin_dashboard_on_login(): void
    {
        $user = User::factory()->create([
            'role' => 'ketua',
            'is_anggota' => true,
        ]);

        $response = $this->post('/login', [
            'identifier' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_member_redirects_to_member_dashboard_on_login(): void
    {
        $user = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
        ]);

        $response = $this->post('/login', [
            'identifier' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));
    }

    public function test_dual_role_user_can_access_admin_routes(): void
    {
        $user = User::factory()->create([
            'role' => 'pengurus',
            'is_anggota' => true,
        ]);

        $response = $this->actingAs($user)->get(route('admin.users.index'));
        $response->assertStatus(200);
    }

    public function test_dual_role_user_can_access_member_routes(): void
    {
        // Member routes only require auth middleware
        $user = User::factory()->create([
            'role' => 'ketua',
            'is_anggota' => true,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertStatus(200);
    }
}
