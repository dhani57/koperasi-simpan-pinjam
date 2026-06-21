<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacTest extends TestCase
{
    use RefreshDatabase;

    public function test_anggota_cannot_access_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'anggota']);
        $response = $this->actingAs($user)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_bendahara_can_access_admin_dashboard()
    {
        $user = User::factory()->create(['role' => 'bendahara']);
        $response = $this->actingAs($user)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_bendahara_cannot_access_users_management()
    {
        $user = User::factory()->create(['role' => 'bendahara']);
        $response = $this->actingAs($user)->get('/admin/users');
        $response->assertStatus(403);
    }

    public function test_pengurus_can_access_users_management()
    {
        $user = User::factory()->create(['role' => 'pengurus']);
        $response = $this->actingAs($user)->get('/admin/users');
        $response->assertStatus(200);
    }
}
