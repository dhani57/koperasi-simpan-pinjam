<?php

namespace Tests\Feature;

use App\Models\Mutation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMutationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_pengawas_can_view_mutation_logs()
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);

        $response = $this->actingAs($pengawas)->get(route('admin.mutations.index'));
        $response->assertStatus(200);
    }

    public function test_bendahara_can_view_mutation_logs()
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);

        $response = $this->actingAs($bendahara)->get(route('admin.mutations.index'));
        $response->assertStatus(200);
    }

    public function test_ketua_can_view_mutation_logs()
    {
        $ketua = User::factory()->create(['role' => 'ketua']);

        $response = $this->actingAs($ketua)->get(route('admin.mutations.index'));
        $response->assertStatus(200);
    }

    public function test_pengurus_cannot_view_mutation_logs()
    {
        $pengurus = User::factory()->create(['role' => 'pengurus']);

        $response = $this->actingAs($pengurus)->get(route('admin.mutations.index'));
        $response->assertStatus(403);
    }

    public function test_anggota_cannot_view_mutation_logs()
    {
        $anggota = User::factory()->create(['role' => 'anggota']);

        $response = $this->actingAs($anggota)->get(route('admin.mutations.index'));
        $response->assertStatus(403);
    }

    public function test_mutation_search_returns_filtered_results()
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);
        $anggota = User::factory()->create(['role' => 'anggota', 'name' => 'Budi Santoso']);

        Mutation::create([
            'user_id' => $anggota->id,
            'type' => 'simpanan_rutin',
            'amount' => 100000,
            'balance_after' => 100000,
            'description' => 'Simpanan rutin bulan Mei',
        ]);

        $response = $this->actingAs($bendahara)->get(route('admin.mutations.index', ['search' => 'Budi']));
        $response->assertStatus(200);
    }
}
