<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDualRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_has_role_detects_is_anggota_attribute(): void
    {
        $user = User::factory()->create([
            'role' => 'ketua',
            'is_anggota' => true,
        ]);

        $this->assertTrue($user->hasRole('ketua'));
        $this->assertTrue($user->hasRole('anggota'));
        $this->assertFalse($user->hasRole('bendahara'));
    }

    public function test_has_role_for_single_admin_role(): void
    {
        $user = User::factory()->create([
            'role' => 'pengurus',
            'is_anggota' => false,
        ]);

        $this->assertTrue($user->hasRole('pengurus'));
        $this->assertFalse($user->hasRole('anggota'));
    }

    public function test_has_role_for_single_member_role(): void
    {
        $user = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
        ]);

        $this->assertTrue($user->hasRole('anggota'));
        $this->assertFalse($user->hasRole('ketua'));
    }

    public function test_roles_array_returns_combined_roles(): void
    {
        $dualUser = User::factory()->create([
            'role' => 'bendahara',
            'is_anggota' => true,
        ]);

        $this->assertEqualsCanonicalizing(['bendahara', 'anggota'], $dualUser->roles_array);

        $adminOnlyUser = User::factory()->create([
            'role' => 'pengawas',
            'is_anggota' => false,
        ]);

        $this->assertEqualsCanonicalizing(['pengawas'], $adminOnlyUser->roles_array);

        $memberOnlyUser = User::factory()->create([
            'role' => 'anggota',
            'is_anggota' => true,
        ]);

        $this->assertEqualsCanonicalizing(['anggota'], $memberOnlyUser->roles_array);
    }
}
