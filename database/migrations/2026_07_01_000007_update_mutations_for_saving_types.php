<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mutations', function (Blueprint $table) {
            $table->string('saving_type')->nullable()->after('type'); // pokok, wajib, sukarela
        });
    }

    public function down(): void
    {
        Schema::table('mutations', function (Blueprint $table) {
            $table->dropColumn('saving_type');
        });
    }
};
