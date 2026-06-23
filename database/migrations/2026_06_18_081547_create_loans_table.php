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
            $table->integer('tenor_years')->default(0)->comment('Tenor dalam tahun');
            $table->text('purpose')->nullable()->comment('Keterangan keperluan pinjaman');
            $table->decimal('monthly_principal_installment', 15, 2)->comment('Cicilan pokok per bulan');
            $table->decimal('current_remaining_principal', 15, 2)->default(0)->comment('Sisa pokok pinjaman saat ini');
            $table->decimal('current_year_monthly_fee', 15, 2)->default(0)->comment('Jasa per bulan tahun berjalan (cache)');
            $table->string('status')->default('diajukan');
            $table->timestamp('admin_verified_at')->nullable()->comment('Waktu diverifikasi awal oleh Admin');
            $table->foreignId('admin_verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('ketua_approved_at')->nullable()->comment('Waktu disetujui oleh Ketua');
            $table->foreignId('ketua_approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('bendahara_approved_at')->nullable()->comment('Waktu disetujui/dicairkan oleh Bendahara');
            $table->foreignId('bendahara_approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('disbursed_at')->nullable()->comment('Waktu pencairan dana');
            $table->string('transfer_proof_path')->nullable()->comment('Bukti transfer pencairan');
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
