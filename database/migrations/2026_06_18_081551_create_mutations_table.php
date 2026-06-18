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
        Schema::create('mutations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->string('type')->comment('Jenis mutasi, cth: simpanan_rutin, pencairan_pinjaman, dll');
            $table->decimal('amount', 15, 2)->comment('Nominal transaksi');
            $table->decimal('balance_after', 15, 2)->comment('Saldo akhir setelah transaksi');
            $table->text('description')->nullable()->comment('Keterangan/deskripsi mutasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutations');
    }
};
