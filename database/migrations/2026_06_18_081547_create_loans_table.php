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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->decimal('principal_amount', 15, 2)->comment('Pokok pinjaman');
            $table->decimal('cooperative_fee_percentage', 5, 2)->comment('Persentase jasa koperasi');
            $table->integer('tenor_months')->comment('Tenor dalam bulan');
            $table->decimal('monthly_installment', 15, 2)->comment('Angsuran per bulan (pokok + jasa)');
            $table->enum('status', ['menunggu', 'aktif', 'lunas', 'ditolak'])->default('menunggu');
            $table->timestamp('disbursed_at')->nullable()->comment('Waktu pencairan dana');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
