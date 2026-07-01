<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('deduction_periods', function (Blueprint $table) {
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->onDelete('set null')->after('is_active');
            $table->timestamp('confirmed_at')->nullable()->after('confirmed_by');
        });
    }

    public function down(): void
    {
        Schema::table('deduction_periods', function (Blueprint $table) {
            $table->dropForeign(['confirmed_by']);
            $table->dropColumn(['confirmed_by', 'confirmed_at']);
        });
    }
};
