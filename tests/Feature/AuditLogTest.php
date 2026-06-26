<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\UserActivityLog;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_pengawas_can_access_audit_logs()
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);
        
        $response = $this->actingAs($pengawas)->get(route('admin.audit-logs.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/AuditLogs/Index'));
    }

    public function test_ketua_cannot_access_audit_logs()
    {
        $ketua = User::factory()->create(['role' => 'ketua']);
        
        $response = $this->actingAs($ketua)->get(route('admin.audit-logs.index'));
        
        $response->assertStatus(403);
    }

    public function test_anggota_cannot_access_audit_logs()
    {
        $anggota = User::factory()->create(['role' => 'anggota']);
        
        $response = $this->actingAs($anggota)->get(route('admin.audit-logs.index'));
        
        $response->assertStatus(403);
    }

    public function test_audit_log_records_access_for_pengawas()
    {
        $pengawas = User::factory()->create(['role' => 'pengawas']);
        
        $this->actingAs($pengawas)->get(route('admin.audit-logs.index'));
        
        $this->assertDatabaseHas('user_activity_logs', [
            'user_id' => $pengawas->id,
            'activity_type' => 'audit_access',
        ]);
    }
}
