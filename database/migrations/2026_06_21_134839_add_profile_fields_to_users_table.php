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
            $table->string('profile_photo_path')->nullable();
            $table->string('department')->nullable();
            $table->date('joined_at')->nullable();
            $table->string('job_title')->nullable();
            $table->date('job_start_date')->nullable();
            $table->date('job_end_date')->nullable();
            $table->timestamp('last_login_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_photo_path',
                'department',
                'joined_at',
                'job_title',
                'job_start_date',
                'job_end_date',
                'last_login_at',
            ]);
        });
    }
};
