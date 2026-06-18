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
        Schema::create('deduction_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deduction_period_id')->constrained('deduction_periods')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('loan_id')->nullable()->constrained('loans')->onDelete('restrict');
            $table->decimal('routine_saving_amount', 15, 2)->default(0)->comment('Bayar simpanan rutin');
            $table->decimal('loan_principal_amount', 15, 2)->default(0)->comment('Bayar pokok pinjaman');
            $table->decimal('loan_fee_amount', 15, 2)->default(0)->comment('Bayar jasa pinjaman');
            $table->enum('status', ['menunggu', 'berhasil', 'gagal'])->default('menunggu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deduction_details');
    }
};
