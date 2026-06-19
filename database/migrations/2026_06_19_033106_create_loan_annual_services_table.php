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
        Schema::create('loan_annual_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained('loans')->onDelete('cascade');
            $table->integer('year_number')->comment('Tahun ke-n');
            $table->decimal('starting_remaining_principal', 15, 2)->comment('Sisa pokok awal tahun');
            $table->decimal('monthly_fee', 15, 2)->comment('Jasa per bulan yang berlaku');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_annual_services');
    }
};
