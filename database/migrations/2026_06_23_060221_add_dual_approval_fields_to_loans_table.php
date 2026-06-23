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
            $table->string('status')->default('diajukan')->change();
            $table->timestamp('bendahara_approved_at')->nullable();
            $table->foreignId('bendahara_approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('ketua_approved_at')->nullable();
            $table->foreignId('ketua_approved_by')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['bendahara_approved_by']);
            $table->dropForeign(['ketua_approved_by']);
            $table->dropColumn([
                'bendahara_approved_at',
                'bendahara_approved_by',
                'ketua_approved_at',
                'ketua_approved_by'
            ]);
        });
    }
};
