<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin user needed to access UserController
        $this->admin = User::factory()->create([
            'role' => 'pengurus',
            'is_anggota' => false,
        ]);
    }

    public function test_validation_fails_if_more_than_two_roles_selected(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'John Doe',
            'identity_number' => '1234567890',
            'email' => 'john@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
            'roles' => ['anggota', 'ketua', 'bendahara'],
        ]);

        $response->assertSessionHasErrors('roles');
        $this->assertEquals(0, User::where('email', 'john@example.com')->count());
    }

    public function test_validation_fails_if_multiple_admin_roles_selected(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Jane Doe',
            'identity_number' => '0987654321',
            'email' => 'jane@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
            'roles' => ['ketua', 'bendahara'],
        ]);

        // Custom validation error message "Hanya diperbolehkan maksimal 1 peran administratif..."
        $response->assertSessionHasErrors('roles');
        $this->assertEquals(0, User::where('email', 'jane@example.com')->count());
    }

    public function test_user_successfully_created_with_dual_role(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Dual Role User',
            'identity_number' => '55555555',
            'email' => 'dual@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
            'roles' => ['bendahara', 'anggota'],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.users.index'));

        $user = User::where('email', 'dual@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('bendahara', $user->role);
        $this->assertTrue($user->is_anggota);
    }

    public function test_user_can_be_updated_successfully(): void
    {
        $user = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.users.update', $user->id), [
            'name' => 'Updated Name',
            'identity_number' => $user->identity_number,
            'email' => $user->email,
            'monthly_simpanan_wajib' => 200000,
            'max_salary_deduction_limit' => 3000000,
            'roles' => ['anggota'],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.users.index'));

        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
        $this->assertEquals(200000, $user->monthly_simpanan_wajib);
        $this->assertEquals(3000000, $user->max_salary_deduction_limit);
    }

    public function test_user_update_with_optional_password(): void
    {
        $user = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
        ]);

        // Update tanpa password → password tidak berubah
        $response = $this->actingAs($this->admin)->put(route('admin.users.update', $user->id), [
            'name' => $user->name,
            'identity_number' => $user->identity_number,
            'email' => $user->email,
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
            'roles' => ['anggota'],
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.users.index'));
    }

    public function test_user_can_be_deleted(): void
    {
        $user = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.users.destroy', $user->id));

        $response->assertRedirect(route('admin.users.index'));
        $this->assertNull(User::find($user->id));
    }

    public function test_pengawas_can_view_users_list(): void
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);

        $response = $this->actingAs($pengawas)->get(route('admin.users.index'));
        $response->assertStatus(200);
    }

    public function test_pengawas_cannot_create_user(): void
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);

        $response = $this->actingAs($pengawas)->post(route('admin.users.store'), [
            'name' => 'Should Fail',
            'identity_number' => '9999999',
            'email' => 'shouldfail@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'monthly_simpanan_wajib' => 100000,
            'max_salary_deduction_limit' => 1000000,
            'roles' => ['anggota'],
        ]);

        $response->assertStatus(403);
        $this->assertEquals(0, User::where('email', 'shouldfail@example.com')->count());
    }

    public function test_pengawas_cannot_delete_user(): void
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);
        $user = User::factory()->create(['role' => 'anggota']);

        $response = $this->actingAs($pengawas)->delete(route('admin.users.destroy', $user->id));

        $response->assertStatus(403);
        $this->assertNotNull(User::find($user->id));
    }

    public function test_bendahara_cannot_access_user_management(): void
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);

        $response = $this->actingAs($bendahara)->get(route('admin.users.index'));
        $response->assertStatus(403);
    }
}
