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
            'monthly_saving_nominal' => 100000,
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
            'monthly_saving_nominal' => 100000,
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
            'monthly_saving_nominal' => 100000,
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
}
