<?php

namespace Tests\Feature;

use App\Models\Loan;
use App\Models\Mutation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SecurityAndIntegrityTest extends TestCase
{
    use RefreshDatabase;

    public function test_mutation_table_is_immutable()
    {
        // SEC-01: Immutability tabel Mutasi
        $user = User::factory()->create();

        $mutation = Mutation::create([
            'user_id' => $user->id,
            'type' => 'simpanan',
            'amount' => 100000,
            'balance_after' => 100000,
            'description' => 'Test',
        ]);

        // Assert DB has the mutation
        $this->assertDatabaseHas('mutations', ['id' => $mutation->id]);

        // Expect Exception when updating
        $this->expectException(\Illuminate\Database\QueryException::class);
        $this->expectExceptionMessageMatches('/Updates are not allowed/i');
        
        DB::statement('UPDATE mutations SET amount = 200000 WHERE id = ?', [$mutation->id]);
        
        // Also test deletion constraint if we catch the first one
        // Wait, expectException will halt the execution of the rest of the test.
        // Let's create a separate test for deletion.
    }

    public function test_mutation_table_forbids_delete()
    {
        $user = User::factory()->create();

        $mutation = Mutation::create([
            'user_id' => $user->id,
            'type' => 'simpanan',
            'amount' => 100000,
            'balance_after' => 100000,
            'description' => 'Test',
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        $this->expectExceptionMessageMatches('/Deletes are not allowed/i');

        DB::statement('DELETE FROM mutations WHERE id = ?', [$mutation->id]);
    }

    public function test_disbursement_requires_transfer_proof()
    {
        // BEN-03: Cairkan tanpa bukti transfer ditolak
        $bendahara = User::factory()->create(['role' => 'bendahara']);
        $this->actingAs($bendahara);

        $anggota = User::factory()->create(['role' => 'anggota']);
        $loan = Loan::create([
            'user_id' => $anggota->id,
            'principal_amount' => 5000000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 12,
            'monthly_principal_installment' => 5000000 / 12,
            'current_remaining_principal' => 5000000,
            'current_year_monthly_fee' => 75000,
            'status' => 'disetujui'
        ]);

        // Coba cairkan tanpa file upload
        $response = $this->post("/admin/loans/{$loan->id}/disburse", []);

        $response->assertSessionHasErrors('transfer_proof');
        $this->assertEquals('disetujui', $loan->fresh()->status);
    }

    public function test_disbursement_success_with_transfer_proof()
    {
        // BEN-04: Cairkan dengan bukti transfer
        $bendahara = User::factory()->create(['role' => 'bendahara']);
        $this->actingAs($bendahara);

        $anggota = User::factory()->create(['role' => 'anggota']);
        $loan = Loan::create([
            'user_id' => $anggota->id,
            'principal_amount' => 5000000,
            'cooperative_fee_percentage' => 1.5,
            'tenor_months' => 12,
            'monthly_principal_installment' => 5000000 / 12,
            'current_remaining_principal' => 5000000,
            'current_year_monthly_fee' => 75000,
            'status' => 'disetujui'
        ]);

        $file = UploadedFile::fake()->image('bukti.jpg');

        $response = $this->post("/admin/loans/{$loan->id}/disburse", [
            'transfer_proof' => $file
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals('menunggu_pencairan', $loan->fresh()->status);
        $this->assertNotNull($loan->fresh()->transfer_proof_path);
    }
}
