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
        // 1. Drop existing check constraint if it exists (Laravel naming convention)
        try {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE deduction_periods DROP CONSTRAINT deduction_periods_status_check');
        } catch (\Exception $e) {
            // Ignore if constraint doesn't exist
        }

        // 2. Change column to string to avoid complex enum migrations
        Schema::table('deduction_periods', function (Blueprint $table) {
            $table->string('status')->default('proses')->change();
        });

        // 3. Update existing data
        \Illuminate\Support\Facades\DB::table('deduction_periods')->whereIn('status', ['draf', 'diekspor_ke_hrd'])->update(['status' => 'proses']);
        \Illuminate\Support\Facades\DB::table('deduction_periods')->where('status', 'selesai_divalidasi')->update(['status' => 'selesai']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deduction_periods', function (Blueprint $table) {
            $table->string('status')->default('draf')->change();
        });
        
        \Illuminate\Support\Facades\DB::table('deduction_periods')->where('status', 'proses')->update(['status' => 'draf']);
        \Illuminate\Support\Facades\DB::table('deduction_periods')->where('status', 'selesai')->update(['status' => 'selesai_divalidasi']);
    }
};
