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
            $table->boolean('is_anggota')->default(false)->after('role')->comment('Menandakan apakah pengguna memiliki hak sebagai anggota koperasi');
        });

        // Initialize existing members
        \Illuminate\Support\Facades\DB::table('users')->where('role', 'anggota')->update(['is_anggota' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_anggota');
        });
    }
};
