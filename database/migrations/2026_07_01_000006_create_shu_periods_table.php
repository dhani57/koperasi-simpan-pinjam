<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shu_periods', function (Blueprint $table) {
            $table->id();
            $table->integer('year')->unique();
            $table->decimal('total_jasa_income', 15, 2)->default(0);
            
            // Persentase
            $table->decimal('persen_dana_sosial', 5, 2)->default(0);
            $table->decimal('persen_thr_pengurus', 5, 2)->default(0);
            $table->decimal('persen_shu_simpanan', 5, 2)->default(0);
            $table->decimal('persen_shu_jasa', 5, 2)->default(0);
            $table->decimal('persen_modal', 5, 2)->default(0);
            
            // Nominal
            $table->decimal('nominal_dana_sosial', 15, 2)->default(0);
            $table->decimal('nominal_thr', 15, 2)->default(0);
            $table->decimal('nominal_shu_simpanan', 15, 2)->default(0);
            $table->decimal('nominal_shu_jasa', 15, 2)->default(0);
            $table->decimal('nominal_modal', 15, 2)->default(0);
            
            $table->enum('status', ['draf', 'disetujui_ketua', 'selesai'])->default('draf');
            
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shu_periods');
    }
};
