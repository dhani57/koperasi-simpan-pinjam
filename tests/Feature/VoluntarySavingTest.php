<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\VoluntarySavingRequest;

class VoluntarySavingTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_create_voluntary_saving_request()
    {
        $member = clone User::factory()->create(['role' => 'anggota']);

        $response = $this->actingAs($member)->post(route('member.voluntary-saving-requests.store'), [
            'proposed_amount' => 200000,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('voluntary_saving_requests', [
            'user_id' => $member->id,
            'new_monthly_amount' => 200000,
            'status' => 'menunggu',
        ]);
    }

    public function test_bendahara_can_approve_voluntary_saving_request()
    {
        $bendahara = User::factory()->create(['role' => 'bendahara']);
        $member = User::factory()->create(['role' => 'anggota', 'monthly_simpanan_wajib' => 100000, 'simpanan_sukarela_balance' => 0]);

        $request = VoluntarySavingRequest::create([
            'user_id' => $member->id,
            'type' => 'ubah_nominal',
            'amount' => 0,
            'new_monthly_amount' => 500000,
            'status' => 'menunggu',
            'balance_before' => 0,
            'balance_after' => 0,
        ]);

        $response = $this->actingAs($bendahara)->post(route('admin.voluntary_saving_requests.approve', $request->id));

        $response->assertRedirect();
        $this->assertDatabaseHas('voluntary_saving_requests', [
            'id' => $request->id,
            'status' => 'disetujui',
        ]);
    }
}
