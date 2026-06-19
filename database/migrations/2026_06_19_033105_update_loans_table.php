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
        Schema::table('loans', function (Blueprint $table) {
            $table->renameColumn('monthly_installment', 'monthly_principal_installment');
            $table->integer('tenor_years')->default(0)->comment('Tenor dalam tahun');
            $table->decimal('current_remaining_principal', 15, 2)->default(0)->comment('Sisa pokok pinjaman saat ini');
            $table->decimal('current_year_monthly_fee', 15, 2)->default(0)->comment('Jasa per bulan tahun berjalan (cache)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['tenor_years', 'current_remaining_principal', 'current_year_monthly_fee']);
            $table->renameColumn('monthly_principal_installment', 'monthly_installment');
        });
    }
};
