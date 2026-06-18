<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('identity_number')->unique()->after('name')->comment('NIP/NIM');
            $table->enum('role', ['anggota', 'bendahara', 'pengurus', 'ketua', 'pengawas'])->default('anggota')->after('email');
            $table->decimal('monthly_saving_nominal', 15, 2)->default(0)->after('role')->comment('Nominal potongan wajib bulanan');
            $table->decimal('max_salary_deduction_limit', 15, 2)->default(0)->after('monthly_saving_nominal')->comment('Limit maksimal gaji yang boleh dipotong');
            $table->decimal('total_saving_balance', 15, 2)->default(0)->after('max_salary_deduction_limit')->comment('Total saldo simpanan saat ini');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'identity_number',
                'role',
                'monthly_saving_nominal',
                'max_salary_deduction_limit',
                'total_saving_balance'
            ]);
        });
    }
};
